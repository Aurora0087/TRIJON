"use server"

import mongoose from "mongoose";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import UserModel from "../models/user.model";
import dbConnect from "../connect";
import { getImageUrl } from "../aws/s3/Utils";


export async function addToCart({
    email, productId, quantity, size, color
}: {
    email: string, productId: string, quantity: string, size: string, color: string
}) {

    try {
        await dbConnect()
        // Find the user by email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            throw new Error("User not found");
        }

        // Validate the product
        const product = await Product.findById(productId).exec();
        if (!product) {
            throw new Error("Product not found");
        }

        // Find or create the cart for the user
        let cart = await Cart.findOne({ userId: user._id }).exec();
        if (!cart) {
            cart = new Cart({ userId: user._id, products: [] });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(
            (item: { productId: { toString: () => string; }; size: string; color: string; }) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (existingProductIndex >= 0) {
            // Update the quantity if the product is already in the cart
            cart.products[existingProductIndex].quantity += Number(quantity);
            cart.products[existingProductIndex].price += Number(quantity) * product.buyingPrice
        } else {
            // Add the product to the cart
            cart.products.push({
                productId: product._id,
                quantity: Number(quantity),
                price: Number(quantity) * product.buyingPrice,
                size,
                color,
            });
        }

        // Save the updated cart
        await cart.save();

        return JSON.parse(JSON.stringify(cart));
    } catch (error) {
        console.error("Error adding to cart: ", error);
        throw new Error("Error adding to cart");
    }
}

export async function getCartItemsByEmail({ email }: { email: string }) {

    try {
        await dbConnect()

        // Find the user by email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            throw new Error("User not found");
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ userId: user._id })
            .populate('products.productId', 'title imageList')
            .exec();

        if (!cart) {
            return { products: [] };
        }

        // Generate signed URLs for imageList
        const productsWithImageUrls = await Promise.all(cart.products.map(async (product: { toObject: () => any; }) => {
            const productWithUrls = { ...product.toObject() };
            if (productWithUrls.productId.imageList) {
                productWithUrls.productId.imageList = await Promise.all(
                    productWithUrls.productId.imageList.map(async (key: string) => await getImageUrl(key))
                );
            }
            return productWithUrls;
        }))

        return JSON.parse(JSON.stringify({ products: productsWithImageUrls }))
    } catch (error) {
        console.error("Error retrieving cart items: ", error);
        throw new Error("Error retrieving cart items");
    }
}

export async function deleteCartItems({itemId}: {itemId:string}) {
    
    try {
        await dbConnect();

        // Update the cart by pulling the item with the specified itemId
        const updatedCart = await Cart.findOneAndUpdate(
            { 'products._id': itemId },
            { $pull: { products: { _id: itemId } } },
            { new: true }
        ).exec();

        if (!updatedCart) {
            throw new Error("Cart item not found");
        }

        return JSON.parse(JSON.stringify(updatedCart));
    } catch (error) {
        console.error("Error deleting cart item: ", error);
        throw new Error("Error deleting cart item");
    }
}
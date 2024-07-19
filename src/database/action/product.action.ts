"use server"

import { deleteImage, getImageUrl, uploadImage } from "../aws/s3/Utils";
import dbConnect from "../connect";
import Cart from "../models/cart.model";
import Product, { IProduct } from "../models/product.model";
import UserModel from "../models/user.model";

import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

interface varientProp {
    size: string;
    colors: {
        name: string;
        value: string;
        stockes: string;
    }[]
}

export async function createNewProduct({
    title,
    description,
    categorys,
    buyingPrice,
    mainPrice,
    imageList,
    varient,
    tax,
    packaging,
    deliveryCharges,
}: {
    title: string;
    description: string;
    categorys: string;
    buyingPrice: string;
    mainPrice: string;
    imageList: string[];
    varient: varientProp[];
    tax: string;
    packaging: string;
    deliveryCharges: string;
}) {
    try {
        const imageUrls = await Promise.all(
            imageList.map(async (base64String) => {
                const buffer = Buffer.from(base64String.split(',')[1], 'base64');
                const imageUrl = await uploadImage(buffer);
                return imageUrl;
            })
        );

        await dbConnect();
        const category = categorys.toLowerCase().split(",");

        const setVarients = varient.map((v) => ({
            size: v.size,
            colors: v.colors.map((c) => ({
                name: c.name,
                value: c.value,
                stockes: Number(c.stockes),
            })),
        }));

        const product = new Product({
            title,
            description,
            category,
            buyingPrice: Number(buyingPrice),
            mainPrice: Number(mainPrice),
            imageList: imageUrls,
            varient: setVarients,
            tax: Number(tax),
            packaging: Number(packaging),
            deliveryCharges: Number(deliveryCharges),
        });

        const savedProduct = await product.save();
        return JSON.parse(JSON.stringify(savedProduct));
    } catch (error) {
        console.log(error);
        throw new Error(`Error saving product, ${error as string}`);
    }
}

export async function editProductDetails({
    title,
    description,
    categorys,
    buyingPrice,
    mainPrice,
    productId,
    varient,
    tax,
    packaging,
    deliveryCharges,
}: {
    title: string;
    description: string;
    categorys: string;
    buyingPrice: string;
    mainPrice: string;
    productId: string;
    varient: varientProp[];
    tax: string;
    packaging: string;
    deliveryCharges: string;
}) {
    try {
        await dbConnect();
        const category = categorys.toLowerCase().split(",");

        const updatedVarients = varient.map((v) => ({
            size: v.size,
            colors: v.colors.map((c) => ({
                name: c.name,
                value: c.value,
                stockes: Number(c.stockes),
            })),
        }));

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                title,
                description,
                category,
                buyingPrice: Number(buyingPrice),
                mainPrice: Number(mainPrice),
                tax: Number(tax),
                packaging: Number(packaging),
                deliveryCharges: Number(deliveryCharges),
                varient: updatedVarients,
            },
            { new: true }
        );

        if (!updatedProduct) {
            throw new Error("Product not found");
        }

        // Fetch all carts containing the product
        const carts = await Cart.find({ 'products.productId': productId }).exec();

        // Update each cart's product prices
        for (const cart of carts) {
            cart.products.forEach((product: { productId: { toString: () => string; }; price: number; quantity: number; }) => {
                if (product.productId.toString() === productId) {
                    product.price = updatedProduct.buyingPrice * product.quantity;
                }
            });
            await cart.save();
        }

        return JSON.parse(JSON.stringify(updatedProduct));
    } catch (error: any) {
        console.error("Error updating product: ", error);
        throw new Error(`Error updating product: ${error.message}`);
    }
}


export async function editProductImages({
    imageList,
    productId,
}: {
    imageList: string[];
    productId: string;
}) {
    try {
        // Upload new images to AWS S3
        const uploadedKeys = await Promise.all(
            imageList.map(async (image) => {
                const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
                const key = await uploadImage(buffer);
                return key;
            })
        );

        // Fetch existing product
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Delete old images from S3
        await Promise.all(product.imageList.map(deleteImage));

        // Update product with new image keys
        product.imageList = uploadedKeys;
        await product.save();

        return product.toJSON(); // Return JSON representation of the updated product
    } catch (error) {
        console.error("Error updating product images:", error);
        throw new Error("Error updating product images");
    }
}

export async function deleteProductDetails({ productId }: { productId: string }) {
    try {
        // Fetch the product
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if images exist before trying to map
        if (product.imageList && product.imageList.length > 0) {
            // Delete images from S3
            await Promise.all(product.imageList.map(async (imageKey: string) => {
                await deleteImage(imageKey);
            }));
        }

        // Remove productId from all wishlists
        await UserModel.updateMany(
            { wishList: productId },
            { $pull: { wishList: productId } }
        );

        // Remove productId from all carts
        await Cart.updateMany(
            { "products.productId": productId },
            { $pull: { products: { productId } } }
        );

        // Delete the product
        await Product.findByIdAndDelete(productId);

        return JSON.parse(JSON.stringify("Product Deleted."));
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Error deleting product');
    }
}

export async function getProducts(
    { page }: { page: number }
) {

    try {
        await dbConnect();

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .exec();

        /*const productsWithImageUrls = await Promise.all(
            products.map(async (product) => {
                const imageUrls = await Promise.all(
                    product.imageList.map(async (key: string) => {
                        try {
                            const url = await getImageUrl(key);
                            return url;
                        } catch (error) {
                            console.error("Error retrieving image URL for key: ", key, error);
                            return "";
                        }
                    })
                )
                return {
                    ...product.toObject(),
                    imageList: imageUrls,
                };
            })
        );*/

        return JSON.parse(JSON.stringify({
            products,
        }));
    } catch (error) {
        throw new Error("Error fetching products");
    }
}


export async function getProductsByCategory(
    { category, page }: { category: string[], page: number }
) {
    const itemsPerPage = 20;
    const skipItems = (page - 1) * itemsPerPage;

    try {
        await dbConnect();

        const normalizedCategory = category.map((c) => c.toLowerCase());
        const query = normalizedCategory.length > 0 ? { category: { $in: normalizedCategory } } : {};

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skipItems)
            .limit(itemsPerPage)
            .exec();

        const totalItems = await Product.countDocuments(query);

        const productsWithImageUrls = await Promise.all(
            products.map(async (product) => {
                const imageUrls = await Promise.all(
                    product.imageList.map(async (key: string) => {
                        try {
                            const url = await getImageUrl(key);
                            return url;
                        } catch (error) {
                            console.error("Error retrieving image URL for key: ", key, error);
                            return "";
                        }
                    })
                )

                return {
                    ...product.toObject(),
                    imageList: imageUrls,
                }
            })
        )

        const isMore = totalItems > page * itemsPerPage;

        return JSON.parse(JSON.stringify({
            products: productsWithImageUrls,
            currentPage: page,
            totalPages: Math.ceil(totalItems / itemsPerPage),
            isMore
        }));
    } catch (error) {
        throw new Error("Error fetching products by category");
    }
}

export async function getProductsBySameCategory(
    { category, page, productId }: { category: string[], page: number, productId: string }
) {
    const itemsPerPage = 20;
    const skipItems = (page - 1) * itemsPerPage;

    try {
        await dbConnect();

        const normalizedCategory = category.map((c) => c.toLowerCase());
        const query = {
            category: { $in: normalizedCategory },
            _id: { $ne: productId }
        };

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skipItems)
            .limit(itemsPerPage)
            .exec();

        const totalItems = await Product.countDocuments(query);

        const productsWithImageUrls = await Promise.all(
            products.map(async (product) => {
                const imageUrls = await Promise.all(
                    product.imageList.map(async (key: string) => {
                        try {
                            const url = await getImageUrl(key);
                            return url;
                        } catch (error) {
                            console.error("Error retrieving image URL for key: ", key, error);
                            return "";
                        }
                    })
                );

                return {
                    ...product.toObject(),
                    imageList: imageUrls,
                };
            })
        );

        const isMore = totalItems > page * itemsPerPage;

        return JSON.parse(JSON.stringify({
            products: productsWithImageUrls,
            currentPage: page,
            totalPages: Math.ceil(totalItems / itemsPerPage),
            isMore
        }));
    } catch (error) {
        throw new Error("Error fetching products by same category");
    }
}

export async function getProductsById({ id }: { id: string }) {
    await dbConnect();

    try {
        const product = await Product.findById(id).exec();
        if (!product) {
            throw new Error("Product not found");
        }

        const productImageUrls = await Promise.all(
            product.imageList.map(async (key: string) => {
                try {
                    const url = await getImageUrl(key);
                    return url;
                } catch (error) {
                    console.error("Error retrieving image URL for key: ", key, error);
                    return "";
                }
            })
        )

        return JSON.parse(JSON.stringify(
            {
                ...product.toObject(),
                imageList: productImageUrls,
            }
        ));
    } catch (error) {

        throw new Error("Error retrieving product by ID");
    }
}

export async function addToWishList({ email, productId }: { email: string, productId: string }) {
    await dbConnect()
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if the product is already in the user's wishList
    const productExistsInWishlist = user.wishList.some((wishlistItem: any) => wishlistItem.equals(productId));

    if (productExistsInWishlist) {
        throw new Error("Product already exists in wishlist");
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    // Add the product to the user's wishList
    user.wishList.push(productId);
    await user.save();

    // Return the updated user object
    return JSON.parse(JSON.stringify(user));
}

export async function getWishListByEmail({ email }: { email: string }): Promise<IProduct[]> {
    await dbConnect();

    try {
        // Find the user by ID and populate the wishList with product details
        const user = await UserModel.findOne({ email }).populate({
            path: "wishList",
            model: "Product", // Adjust "Product" to match your actual model name for Product
        }).exec();

        if (!user) {
            throw new Error("User not found");
        }

        // Extract populated product details from the wishList
        const wishlistedProducts: IProduct[] = await Promise.all(user.wishList.map(async (wishlistItem: any) => {
            const productDetails = {
                _id: wishlistItem._id,
                title: wishlistItem.title,
                description: wishlistItem.description,
                category: wishlistItem.category,
                buyingPrice: wishlistItem.buyingPrice,
                mainPrice: wishlistItem.mainPrice,
                rating: wishlistItem.rating,
                imageList: wishlistItem.imageList,
                varient: wishlistItem.varient,
                createdAt: wishlistItem.createdAt,
                updatedAt: wishlistItem.updatedAt,
            };
            // Fetch image URLs for each product
            const imageUrls: string[] = await Promise.all(wishlistItem.imageList.map(async (key: string) => {
                try {
                    const url = await getImageUrl(key); // Assuming getImageUrl returns a signed URL
                    return url;
                } catch (error) {
                    console.error("Error retrieving image URL for key: ", key, error);
                    return ""; // Handle error case or return a default URL
                }
            }));

            productDetails.imageList = imageUrls;

            return productDetails;
        }));

        return JSON.parse(JSON.stringify(wishlistedProducts));
    } catch (error) {
        console.error("Error retrieving wishlisted products for user:", error);
        throw new Error("Failed to retrieve wishlisted products. Please try again later.");
    }
}

export async function deleteFromWishList({
    email,
    productId
}: { email: string, productId: string }) {
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the product ID exists in the wishList
        const index = user.wishList.indexOf(productId);

        if (index === -1) {
            throw new Error('Product not found in wish list');
        }

        // Remove the product ID from the wishList array
        user.wishList.splice(index, 1);

        // Save the updated user document
        await user.save();

        return JSON.parse(JSON.stringify({ message: 'Product deleted from wish list successfully' }));
    } catch (error) {
        throw new Error('Failed to delete product from wish list');
    }
}
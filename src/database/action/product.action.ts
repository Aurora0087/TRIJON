"use server"

import { getImageUrl, uploadImage } from "../aws/s3/Utils";
import dbConnect from "../connect";
import Product, { IProduct } from "../models/product.model";
import UserModel from "../models/user.model";

interface varientProp {
    size: string;
    colors: {
        name: string;
        value: string;
        stockes: string;
    }[]
}

export async function createNewProduct({ title, description, categorys, buyingPrice, mainPrice, imageList, varient }:
    {
        title: string,
        description: string,
        categorys: string,
        buyingPrice: string,
        mainPrice: string,
        imageList: string[],
        varient: varientProp[]
    }
) {
    try {

        const imageUrls = await Promise.all(
            imageList.map(async (base64String) => {
                const buffer = Buffer.from(base64String.split(',')[1], 'base64');
                const imageUrl = await uploadImage(buffer);
                return imageUrl;
            })
        )

        await dbConnect()
        const category = categorys.split(",")

        const setVarients = varient.map((v) => ({
            size: v.size,
            colors: v.colors.map((c) => ({
                name: c.name,
                value: c.value,
                stockes: Number(c.stockes),
            })),
        }))

        const product = new Product({
            title: title, description: description, category: category, buyingPrice: Number(buyingPrice), mainPrice: Number(mainPrice), imageList: imageUrls, varient: setVarients
        })

        const savedProduct = await product.save()
        return JSON.parse(JSON.stringify(savedProduct))
    } catch (error) {
        throw new Error("Error saving product");
    }
}

export async function getProductsByCategory(
    { category, page }: { category: string[], page: number }
) {
    const itemsPerPage = 2;
    const skipItems = (page - 1) * itemsPerPage;

    try {
        await dbConnect();

        const query = category.length > 0 ? { category: { $in: category } } : {};

        const products = await Product.find(query)
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
        throw new Error("Error fetching products by category");
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
"use server"

import { getImageUrl, uploadImage } from "../aws/s3/Utils";
import dbConnect from "../connect";
import Product from "../models/product.model";

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

    const itemsPerPage = 10
    const skipItems = (page - 1) * itemsPerPage;

    try {

        await dbConnect()

        const query = category.length > 0 ? { category: { $in: category } } : {}
        
        const products = await Product.find(query)
            .skip(skipItems)
            .limit(itemsPerPage)
            .exec();

        const totalItems = await Product.countDocuments({ category });

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

        return JSON.parse(JSON.stringify({
            products:productsWithImageUrls,
            currentPage: page,
            totalPages: Math.ceil(totalItems / itemsPerPage),
        }))
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

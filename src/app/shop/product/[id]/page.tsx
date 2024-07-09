"use client"

import BackButton from '@/components/BackButton'
import ReviewCard from '@/components/card/ReviewCard'
import PostReview from '@/components/PostReview'
import ProductDetails from '@/components/ProductDetails'
import SemilarProduct from '@/components/SemilarProduct'
import { getProductsById } from '@/database/action/product.action'
import { IProduct } from '@/database/models/product.model'
import { SearchParamProps } from '@/types'
import React, { useEffect, useState } from 'react'

const demoData = {
    id: "1",
    title: "Casual T-Shirt",
    description: "A comfortable and casual T-shirt perfect for everyday wear.",
    buyingPrice: 200,
    mainPrice: 400,
    rating: 4.5,
    images: [
        "/a.png",
        "/a.png",
        "/a.png",
        "/a.png",
        "/a.png",
    ],
    varient: [
        {
            size: "S",
            colors: [
                { name: "Red", value: "#FF0000", stockes: 10 },
                { name: "Blue", value: "#1000FF", stockes: 0 }
            ],
        },
        {
            size: "M",
            colors: [
                { name: "Green", value: "#00FF00", stockes: 5 },
                { name: "Yellow", value: "#FFFF00", stockes: 15 }
            ],
        }
    ]
}

const demoReview = [
    {
        name: 'Elena',
        date: new Date('2023-06-04T15:14:00'),
        rating: 4,
        comment: 'Good jeans, the quality is generally satisfactory, the only downside is that they run a little small.',
        imageUrl: '/path/to/image.jpg' // Adjust the image path as needed
    },
    {
        name: 'John',
        date: new Date('2023-05-22T10:30:00'),
        rating: 5,
        comment: 'The jeans are great! Very comfortable and stylish. Slightly tight around the waist.',

    },
]

function ProductDetailspage({ params: { id } }: SearchParamProps) {

    const [product, setProduct] = useState<IProduct>()

    async function getProduct() {
        await getProductsById({id}).then((res) => {
            setProduct(res)
            console.log(res);
            
        }).catch((r) => {
        })
    }

    useEffect(() => {
        getProduct()
    },[])

    return (
        <div className=' py-8 px-3 w-full bg-slate-50'>
            <div>
                <BackButton />
            </div>
            {product !== undefined ? (
                <>
                    <ProductDetails
                        id={product._id}
                        title={product.title}
                        description={product.description}
                        buyingPrice={product.buyingPrice}
                        mainPrice={product.mainPrice}
                        rating={product.rating}
                        images={product.imageList}
                        varient={product.varient} />
            <div className=' py-8'>
                <div className=' w-full'>
                    <PostReview productId={id} uId=''/>
                </div>
                <div className=' flex flex-col gap-4'>
                    {demoReview.map((data, i) => {
                        return (
                            <ReviewCard key={i} {...data} />
                        )
                    })}
                </div>
            </div>
            <div>
                <SemilarProduct category={"new"} />
            </div>
                </>
                ) : (null)}
        </div>
    )
}

export default ProductDetailspage
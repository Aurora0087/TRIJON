"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './card/ProductCard'
import { IProduct } from '@/database/models/product.model'
import { getProductsByCategory, getProductsBySameCategory } from '@/database/action/product.action'

function SemilarProduct({category,productId}:{category:string,productId:string}) {

    const [products, setProducts] = useState<IProduct[]>([])

    async function getProducts() {
        const res = await getProductsBySameCategory({ category: [category] || [], page: 1, productId:productId })
        setProducts(res.products)
    }

    useEffect(() => {
        getProducts();
    }, [category])

    return (
        <div className=" py-8 w-full px-4">
            <h2 className="text-2xl font-extrabold">Similar Product</h2>
            <div className=' w-full mt-6 grid gap-y-6 sm:grid-cols-2 sm:gap-x-2 md:grid-cols-3 lg:grid-cols-4'>
                {products.slice(0,4).map((data, i) => {
                    const uniqueColors = new Set(data.varient.flatMap((variant) => variant.colors.map((color) => color.name)))
                    return (
                        <div key={i} className=' h-full w-full'>
                            <ProductCard
                                id={data._id}
                                imageSrc={data.imageList[0]}
                                productName={data.title}
                                price={data.buyingPrice}
                                sizes={data.varient.map((v) => (v.size))}
                                colors={uniqueColors.size
                                }
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SemilarProduct
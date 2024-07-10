"use client"

import React, { useEffect, useState } from 'react'
import ProductCard from './card/ProductCard'
import { IProduct } from '@/database/models/product.model'
import { getProductsByCategory } from '@/database/action/product.action'

function SemilarProduct({category}:{category:string}) {

    const [products, setProducts] = useState<IProduct[]>([])

    async function getProducts() {
        const res = await getProductsByCategory({ category: [category] || [], page: 1 })
        setProducts(res.products)
    }

    useEffect(() => {
        getProducts();
    }, [category])

    return (
        <div className=" py-8 w-full px-4">
            <h2 className="text-2xl font-extrabold">Semilar Product</h2>
            <div className=' w-full mt-6 grid grid-cols-2 gap-y-6 sm:grid-cols-2 sm:gap-x-2 md:grid-cols-4'>
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
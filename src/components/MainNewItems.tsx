"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import ProductCard from './card/ProductCard'
import { IProduct } from '@/database/models/product.model'
import { getProductsByCategory } from '@/database/action/product.action'
import { motion } from 'framer-motion'
import ProductCardSkeletons from './skeletons/ProductCardSkeletons'

function MainNewItems() {

    const [products,setProducts] = useState<IProduct[]>([])

    async function getProducts() {
        await getProductsByCategory({ category: [], page: 1 }).then((res) => {
            setProducts(res.products)
        })
    }
    
    useEffect(() => {
        getProducts()
    }, [])
    
    return (
        <div className=" py-8 w-full">
            <h2 className="text-2xl font-extrabold">New Items</h2>
            <div className=' w-full mt-6 grid gap-y-6 gap-x-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {
                    products.length < 1 ? (
                        <>
                            <ProductCardSkeletons />
                            <ProductCardSkeletons/>
                        </>
                    ) : (
                            <>
                {products.map((data, i) => {
                    const uniqueColors = new Set(data.varient.flatMap((variant) => variant.colors.map((color) => color.name)))
                    return (
                    <motion.div key={i} className=' h-full' layout>
                        <ProductCard
                            id={data._id}
                            imageSrc={data.imageList[0]}
                            productName={data.title}
                            price={data.buyingPrice}
                            sizes={data.varient.map((v) => (v.size))}
                            colors={uniqueColors.size}
                        />
                    </motion.div>
                )})}
                </>
                    )
                }
                
            </div>
            <div className=' w-full grid place-content-center py-8'>
                <Link href="/shop/new">
                    <Button className=' rounded-full'>
                        View All
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default MainNewItems
"use client"
import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import ProductCard from './card/ProductCard'
import Link from 'next/link'
import { Button } from './ui/button'
import { getProductsByCategory } from '@/database/action/product.action'
import { IProduct } from '@/database/models/product.model'
import ProductCardSkeletons from './skeletons/ProductCardSkeletons'

function MainBestSell() {


    const [products, setProducts] = useState<IProduct[]>([])

    async function getProducts() {
        await getProductsByCategory({ category: ["best"], page: 1 }).then((res) => {
            setProducts(res.products)
        })
    }

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <div className=" py-8 w-full">
            <h2 className="text-2xl font-extrabold">Best Selling</h2>
            <div className=' w-full'>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full p-8"
                >
                    <CarouselContent>
                        {
                            products.length < 1 ? (
                                <>
                                    <CarouselItem className=" basis-1/2 md:basis-1/3 lg:basis-1/4">
                                        <div className="p-1">
                                            <ProductCardSkeletons />
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className=" basis-1/2 md:basis-1/3 lg:basis-1/4">
                                        <div className="p-1">
                                            <ProductCardSkeletons />
                                        </div>
                                    </CarouselItem>
                                </>
                            ) : (
                                <>
                                    {products.map((data, index) => (
                                        <CarouselItem key={index} className=" basis-1/2 md:basis-1/3 lg:basis-1/4">
                                            <div className="p-1">
                                                <ProductCard
                                                    id={data._id}
                                                    imageSrc={data.imageList[0]}
                                                    productName={data.title}
                                                    price={data.buyingPrice}
                                                    sizes={data.varient.map((v) => (v.size))}
                                                    colors={1}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </>
                            )
                        }

                    </CarouselContent>
                    <CarouselPrevious className=' left-0' />
                    <CarouselNext className=' right-0' />
                </Carousel>
            </div>
            <div className=' w-full grid place-content-center'>
                <Link href="/shop/best">
                    <Button className=' rounded-full'>
                        View All
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default MainBestSell
"use client"

import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react'
import { Button } from './ui/button';
import ProductCard from './card/ProductCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { IProduct } from '@/database/models/product.model';
import { getProductsByCategory } from '@/database/action/product.action';

const items = [
    {
        id: '1',
        name: 'Sleeveless Top',
        price: 80,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: 1,
        imageUrl: '/path_to_image_1', // replace with the actual image path
    },
    {
        id: '2',
        name: 'Mint Dress',
        price: 10,
        sizes: ['XS', 'M', 'L'],
        colors: 17,
        imageUrl: '/path_to_image_2', // replace with the actual image path
    },
    {
        id: '3',
        name: 'Yellow Shirt',
        price: 100,
        sizes: ['XS', 'M', 'L'],
        colors: 2,
        imageUrl: '/path_to_image_3', // replace with the actual image path
    },
    {
        id: '4',
        name: 'Pink Dress',
        price: 120,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: 1,
        imageUrl: '/path_to_image_4', // replace with the actual image path
    },
    {
        id: '5',
        name: 'Black T-Shirt',
        price: 150,
        sizes: ['XS', 'M', 'L'],
        colors: 17,
        imageUrl: '/path_to_image_5', // replace with the actual image path
    },
    {
        id: '6',
        name: 'Beige Top',
        price: 180,
        sizes: ['XS', 'M', 'L'],
        colors: 2,
        imageUrl: '/path_to_image_6', // replace with the actual image path
    },
    {
        id: '7',
        name: 'Black Tank Top and Jeans',
        price: 10,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: 1,
        imageUrl: '/path_to_image_7', // replace with the actual image path
    },
    {
        id: '8',
        name: 'White T-Shirt and Blue Shorts',
        price: 80,
        sizes: ['XS', 'M', 'L'],
        colors: 17,
        imageUrl: '/path_to_image_8', // replace with the actual image path
    },
    {
        id: '9',
        name: 'Ripped Jeans and Sandals',
        price: 500,
        sizes: ['XS', 'M', 'L'],
        colors: 2,
        imageUrl: '/path_to_image_9', // replace with the actual image path
    },
];


function ShopProductItems({category}:{category?:string[]}) {

    const [products, setProducts] = useState<IProduct[]>([])
    const [filter, setFilter] = useState(products)
    const [isMore, setIsMore] = useState(true)
    const [pageNumber,setpageNumber] = useState(1)

    async function getProducts() {
        await getProductsByCategory({ category: [], page: pageNumber }).then((res) => {
            setProducts(res.products)
            setFilter(res.products)

        })
    }

    useEffect(() => {
        getProducts()
    }, [])
    
    function sortByPriceLowToHigh() {
        const sortedItems = [...products].sort((a, b) => a.buyingPrice - b.buyingPrice);
        setFilter(sortedItems);
    }

    function sortByPriceHighToLow() {
        const sortedItems = [...products].sort((a, b) => b.buyingPrice - a.buyingPrice);
        setFilter(sortedItems);
    }

    function filterBySize(size: string) {
        const filteredItems = products.filter((item) =>
            item.varient.some((variant) => variant.size === size)
        );
        setFilter(filteredItems);
    }



    return (
        <div className=' py-8'>
            <div className=' my-8 flex gap-4'>
                <span className=' text-sm text-slate-600'>Filter</span>
                <CollapsibleCard triggerComponent='Price'>
                    <div className=' flex flex-col gap-2 py-4 px-2'>
                        <Button variant='link' onClick={sortByPriceLowToHigh}>Low to High</Button>
                        <Button variant='link' onClick={sortByPriceHighToLow}>High to Low</Button>
                    </div>
                </CollapsibleCard>
                <CollapsibleCard triggerComponent='Size'>
                    <div className=' flex flex-col gap-2 py-4 px-2'>
                        <Button variant='link' onClick={() => setFilter(products)}>Reset</Button>
                        <Button variant='link' onClick={() => filterBySize('XS')}>
                            Filter by XS
                        </Button>
                        <Button variant='link' onClick={() => filterBySize('S')}>
                            Filter by S
                        </Button>
                        <Button variant='link' onClick={() => filterBySize('M')}>
                            Filter by M
                        </Button>
                        <Button variant='link' onClick={() => filterBySize('L')}>
                            Filter by L
                        </Button>
                    </div>
                </CollapsibleCard>
            </div>
            <motion.div className=' grid gap-2 gap-y-4 place-content-center  md:grid-cols-2 lg:grid-cols-3' layout>
                {filter.map((data, i) => {
                    const uniqueColors = new Set(data.varient.flatMap((variant) => variant.colors.map((color) => color.name)))
                    return (
                        <motion.div key={i} className=' h-full w-full' layout>
                            <ProductCard
                                id={data._id}
                                imageSrc={data.imageList[0]}
                                productName={data.title}
                                price={data.buyingPrice}
                                sizes={data.varient.map((v) => (v.size))}
                                colors={uniqueColors.size
                                }
                            />
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    );
}

function CollapsibleCard({ triggerComponent, children }: { triggerComponent: string, children: ReactNode }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={toggleOpen} className=' border-b'>
            <CollapsibleTrigger className=' w-full flex gap-4 justify-between '>
                <h3 className=" mb-4">{triggerComponent}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown />
                </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className='overflow-hidden'
                    >
                        <CollapsibleContent className=' bg-white'>
                            {children}
                        </CollapsibleContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Collapsible>
    )

}

export default ShopProductItems
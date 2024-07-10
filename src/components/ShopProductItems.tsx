"use client"

import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react'
import { Button } from './ui/button';
import ProductCard from './card/ProductCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { IProduct } from '@/database/models/product.model';
import { getProductsByCategory } from '@/database/action/product.action';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from './ui/dropdown-menu';



function ShopProductItems({category}:{category?:string[]}) {

    const [products, setProducts] = useState<IProduct[]>([])
    const [filter, setFilter] = useState<IProduct[]>([])
    const [pageNumber, setPageNumber] = useState(1)

    async function getProducts() {
        const res = await getProductsByCategory({ category: category || [], page: pageNumber })
        setProducts(res.products)
        setFilter(res.products)
    }

    useEffect(() => {
        getProducts();
    }, [category, pageNumber])
    
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
            <div className=' my-8 flex gap-4 items-center'>
                <span className=' text-sm text-slate-600'>Filter</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="link">
                            Price <ChevronDown className="ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Sort by Price</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={sortByPriceLowToHigh}>Low to High</DropdownMenuItem>
                        <DropdownMenuItem onClick={sortByPriceHighToLow}>High to Low</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="link">
                            Size <ChevronDown className="ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by Size</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setFilter(products)}>Reset</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => filterBySize('XS')}>XS</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => filterBySize('S')}>S</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => filterBySize('M')}>M</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => filterBySize('L')}>L</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <motion.div className='grid gap-2 gap-y-4 place-content-center md:grid-cols-2 lg:grid-cols-3' layout>
                <AnimatePresence>
                    {filter.map((data) => {
                        const uniqueColors = new Set(data.varient.flatMap((variant) => variant.colors.map((color) => color.name)))
                        return (
                            <motion.div
                                key={data._id}
                                className='h-full w-full'
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard
                                    id={data._id}
                                    imageSrc={data.imageList[0]}
                                    productName={data.title}
                                    price={data.buyingPrice}
                                    sizes={data.varient.map((v) => (v.size))}
                                    colors={uniqueColors.size}
                                />
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
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
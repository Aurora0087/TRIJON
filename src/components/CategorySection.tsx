import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const categories = [
    {
        name: 'T-Shirt',
        image: '/assets/image/T-shirts.png',
    },
    {
        name: 'Shirt',
        image: '/assets/image/T-shirts.png',
    },
    {
        name: 'Half Sleeve',
        image: '/assets/image/HALF SLEEVE.png',
    },
    {
        name: 'Polo',
        image: '/assets/image/POLO.png',
    },
    {
        name: 'Sale',
        image: '/assets/image/sale.png',
    },
]

const CategorySection = () => {
    return (
        <div className=" py-4">
            <h2 className="text-2xl font-extrabold">Category</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-6">
                {categories.map((category) => (
                    <Link
                        href={`/shop/${category.name}`}
                        key={category.name} className="text-center">
                        <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-full">
                        <Avatar className=' border-2 hover:border-blue-400 w-full h-full'>
                            <AvatarImage src={`/j${category.image}` } className=' w-full h-full object-cover'/>
                            <AvatarFallback className=' animate-pulse rounded-md bg-muted bg-slate-200 text-sm'>
                                {category.name}
                            </AvatarFallback>
                        </Avatar>
                        </div>
                        <h3 className="mt-4 text-sm font-medium">{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const categories = [
    {
        name: 'T-shirts',
        image: '/assets/image/T-shirts.png',
    },
    {
        name: 'Shirts',
        image: '/assets/image/T-shirts.png',
    },
    {
        name: 'HALF SLEEVE',
        image: '/assets/image/HALF SLEEVE.png',
    },
    {
        name: 'SPUN POLO COLLAR',
        image: '/assets/image/SPUN POLO COLLAR.png',
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
                            <img
                                src={"/path/png"}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="mt-4 text-sm font-medium">{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;

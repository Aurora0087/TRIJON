"use client"

import React, { useEffect, useState } from 'react'
import { ImageShower } from './ProductDetails';
import WidthWrraper from './WidthWrraper';

function AdminProductDetails({ id, title, description, buyingPrice, mainPrice, rating, images, varient }: { id: string, title: string, description: string, buyingPrice: number, mainPrice: number, rating: number, images: string[], varient: { size: string, colors: { name: string, value: string, stockes: number }[] }[] }) {
    const [variantIndex, setVarientIndex] = useState(0);
    const [sizeType, setSizeType] = useState(varient[0].size);
    const [colorIndex, setColorIndex] = useState(0);
    const [avalableStock, setAvalableStock] = useState(varient[0].colors[0].stockes);

    useEffect(() => {
        setSizeType(varient[variantIndex].size);
        setColorIndex(0)
        setAvalableStock(varient[variantIndex].colors[0].stockes);
    }, [variantIndex]);

    useEffect(() => {
        setAvalableStock(varient[variantIndex].colors[colorIndex].stockes);
    }, [colorIndex]);

    return (
        <WidthWrraper className=' py-8'>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="grid place-content-center">
                    <ImageShower images={images} />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">
                        {title}
                    </h1>
                    <div className="flex items-center mb-2">
                        <StarRating rating={rating} />
                        <span>{rating}</span>
                    </div>
                    <div className='flex gap-4'>
                        <p className="text-xl font-semibold mb-4 py-2">{`₹ ${buyingPrice}`}</p>
                        {buyingPrice !== mainPrice && (
                            <>
                                <del className="text-red-500 mb-4 text-center py-2">{`₹ ${mainPrice}`}</del>
                                <span className='bg-red-400 rounded-full px-4 py-2 h-fit font-semibold text-white'>{`${(((mainPrice - buyingPrice) / mainPrice) * 100).toFixed(2)}% OFF`}</span>
                            </>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Color:</label>
                        <div className="flex gap-2">
                            {varient[variantIndex].colors.map((v, i) => (
                                <div key={i} className='flex flex-col gap-2 capitalize justify-center items-center'>
                                    
                                    <div
                                        onClick={() => setColorIndex(i)}
                                        style={{ backgroundColor: v.value }}
                                        className={`w-8 h-8 p-1 border-2 rounded-full ${colorIndex === i && "border-[#519fff]"} shadow cursor-pointer`}
                                    ></div>
                                    <span className={`${colorIndex === i && "text-blue-500 font-semibold"} text-sm`}>{v.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Size:</label>
                        <div className="flex gap-2 capitalize">
                            {varient.map((v, i) => (
                                <div key={i}
                                    onClick={() => setVarientIndex(i)}
                                    className={`px-4 py-2 rounded-full border-2 ${variantIndex === i && "border-blue-400"} uppercase cursor-pointer`}>
                                    {v.size}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Available Stock:</label>
                        <span className="text-xl font-semibold mb-4 py-2">{avalableStock}</span>
                    </div>
                </div>
            </div>

            {/* Product Description */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="mb-4">
                    {description}
                </p>
            </div>
        </WidthWrraper>
    );
}

function StarRating({ rating }: { rating: number }) {
    const percentage = (rating / 5) * 100;

    return (
        <div className="relative inline-block">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 120 24"
                className="w-32 h-6"
                fill="none"
                stroke="currentColor"
            >
                <defs>
                    <linearGradient id="grad1">
                        <stop offset={`${percentage}%`} stopColor="gold" />
                        <stop offset={`${percentage}%`} stopColor="gray" />
                    </linearGradient>
                </defs>
                <g stroke="none" strokeWidth="1" fill="url(#grad1)" fillRule="evenodd">
                    <path d="M12 .587l3.668 7.571L24 9.748l-6 5.844 1.418 8.261L12 18.896l-7.418 4.957L6 15.592 0 9.748l8.332-1.59z M36 .587l3.668 7.571L48 9.748l-6 5.844 1.418 8.261L36 18.896l-7.418 4.957L30 15.592 24 9.748l8.332-1.59z M60 .587l3.668 7.571L72 9.748l-6 5.844 1.418 8.261L60 18.896l-7.418 4.957L54 15.592 48 9.748l8.332-1.59z M84 .587l3.668 7.571L96 9.748l-6 5.844 1.418 8.261L84 18.896l-7.418 4.957L78 15.592 72 9.748l8.332-1.59z M108 .587l3.668 7.571L120 9.748l-6 5.844 1.418 8.261L108 18.896l-7.418 4.957L102 15.592 96 9.748l8.332-1.59z" />
                </g>
            </svg>
        </div>
    );
}

export default AdminProductDetails
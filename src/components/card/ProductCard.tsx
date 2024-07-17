
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface ProductCardProps {
    id: string;
    imageSrc: string;
    productName: string;
    price: number;
    sizes: string[];
    colors: number;
    viewColor?: boolean;
}

function ProductCard({ id, imageSrc, productName, price, sizes, colors, viewColor = false }: ProductCardProps) {
    return (
        <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
            <Link href={`/shop/product/${id}`}>
                <div className=' relative p-2 rounded-lg overflow-hidden w-full'>
                    <div className='rounded-lg overflow-hidden w-full'>
                        <Image className="w-full h-64 object-cover" src={imageSrc} alt={productName} width={5000} height={5000} />
                    </div>
                    
                </div>
                <div className="px-4 py-4">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{productName}</h3>
                    <p className="text-gray-700 text-base mb-2">₹ {price.toFixed(2)}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            {sizes.map((size, index) => (
                                <span key={index} className="px-2 py-1 text-sm font-semibold uppercase text-gray-700 bg-gray-200 rounded">
                                    {size}
                                </span>
                            ))}
                        </div>
                        {viewColor && (
                        <span className="text-sm text-gray-600 capitalize">{colors} color{colors !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard
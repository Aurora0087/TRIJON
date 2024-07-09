import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import ProductCard from './card/ProductCard'

function SemilarProduct({category}:{category:string}) {


    return (
        <div className=" py-8 w-full px-4">
            <h2 className="text-2xl font-extrabold">Semilar Product</h2>
            <div className=' w-full mt-6 grid grid-cols-2 gap-y-6 sm:grid-cols-2 sm:gap-x-2 md:grid-cols-4'>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="p-1 flex justify-center">
                        <ProductCard
                            id='111'
                            imageSrc="/path/to/tshirt-image.jpg"
                            productName="Black T-Shirt"
                            price={100}
                            sizes={['XS', 'S', 'M', 'L']}
                            colors={17}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SemilarProduct
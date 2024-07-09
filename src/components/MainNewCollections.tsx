import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const collections = [
    {
        name: 'T-shirts',
        image: '/path-to-your-tshirts-image.jpg',
    },
    {
        name: 'Shirts',
        image: '/path-to-your-shirts-image.jpg',
    },
    {
        name: 'Trackpants',
        image: '/path-to-your-dresses-image.jpg',
    },
]

function MainNewCollections() {
    return (
        <div className=" py-8">
            <h2 className="text-2xl font-extrabold">New Collections</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-1 sm:gap-x-6 md:grid-cols-3">
                {collections.map((category) => (
                    <Link
                        href={`/shop/${category.name}`}
                        key={category.name} className="text-center">
                        <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-3xl">
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="mt-4 text-sm font-medium">{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MainNewCollections
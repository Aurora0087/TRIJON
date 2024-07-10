import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const collections = [
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
]

function MainNewCollections() {
    return (
        <div className=" py-8">
            <h2 className="text-2xl font-extrabold">New Collections</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-1 sm:gap-x-6 md:grid-cols-3">
                {collections.map((collection) => (
                    <Link
                    href={`/shop/${collection.name}`}
                    key={collection.name} className="text-center">
                    <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-full">
                    <Avatar className=' border-2 hover:border-blue-400 w-full h-full'>
                        <AvatarImage src={`/j${collection.image}`} className=' w-full h-full object-cover'/>
                        <AvatarFallback className=' animate-pulse rounded-md bg-muted bg-slate-200 text-sm'>
                            {collection.name}
                        </AvatarFallback>
                    </Avatar>
                    </div>
                    <h3 className="mt-4 text-sm font-medium">{collection.name}</h3>
                </Link>
                ))}
            </div>
        </div>
    )
}

export default MainNewCollections
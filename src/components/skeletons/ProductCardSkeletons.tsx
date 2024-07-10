"use client"

import React from 'react'
import { Skeleton } from '../ui/skeleton'

function ProductCardSkeletons() {
    return (
        <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
            <div className=' relative p-2 rounded-lg overflow-hidden w-full'>
                <Skeleton className="w-full h-64" />
            </div>
            <div className="px-4 py-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        <Skeleton className="h-6 w-10" />
                        <Skeleton className="h-6 w-10" />
                        <Skeleton className="h-6 w-10" />
                    </div>
                    <Skeleton className="h-4 w-10" />
                </div>
            </div>
        </div>
    )
}

export default ProductCardSkeletons
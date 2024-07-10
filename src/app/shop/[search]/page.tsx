"use client"
import CategorySection from '@/components/CategorySection'
import ShopProductItems from '@/components/ShopProductItems'
import { cleanAndSplitString } from '@/lib/utils'
import { SearchBYCategoryParamProps } from '@/types'
import React, { useEffect, useState } from 'react'

function page({ params: { search } }: SearchBYCategoryParamProps) {

    const [categorys, setCategorys] = useState<string[]>([])

    useEffect(() => {
        setCategorys(cleanAndSplitString({inputString:decodeURIComponent(search)}))
    }, [search])
    
    return (
        <div className='min-h-screen my-4 rounded-xl p-8 bg-slate-100 w-full flex flex-col'>
            <div className='border-b-2 border-blue-400'>
                <CategorySection />
            </div>
            <div>
                <ShopProductItems category={categorys} />
            </div>
        </div>
    )
}

export default page
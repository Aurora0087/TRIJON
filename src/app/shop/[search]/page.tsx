"use client"
import BackButton from '@/components/BackButton'
import CategorySection from '@/components/CategorySection'
import ShopProductItems from '@/components/ShopProductItems'
import { cleanAndSplitString } from '@/lib/utils'
import { SearchBYCategoryParamProps } from '@/types'
import React from 'react'

function page({ params: { search } }: SearchBYCategoryParamProps) {

    return (
        <div className='min-h-screen my-4 rounded-xl p-8 bg-slate-100 w-full flex flex-col'>
            <div>
                <BackButton/>
            </div>
            <div className='border-b-2 border-blue-400'>
                <CategorySection />
            </div>
            <div>
                <ShopProductItems category={cleanAndSplitString({inputString:decodeURIComponent(search)})} />
            </div>
        </div>
    )
}

export default page
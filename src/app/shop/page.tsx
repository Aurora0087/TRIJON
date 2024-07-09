import CategorySection from '@/components/CategorySection'
import ShopProductItems from '@/components/ShopProductItems'
import React from 'react'

function Shoppages() {
    return (
        <div className=' min-h-screen my-4 rounded-xl p-8 bg-slate-100 w-full flex flex-col'>
            <div className=' border-b-2 border-blue-400'>
                <CategorySection/>
            </div>
            <div>
                <ShopProductItems/>
            </div>
        </div>
    )
}

export default Shoppages
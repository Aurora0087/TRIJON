import React from 'react'
import WidthWrraper from './WidthWrraper'
import CategorySection from './CategorySection'
import MainBestSell from './MainBestSell'
import MainNewCollections from './MainNewCollections'
import MainNewItems from './MainNewItems'

function MainProductShow() {
    return (
        <WidthWrraper className=' bg-slate-100 py-8'>
            <CategorySection />
            <MainBestSell />
            <MainNewCollections />
            <MainNewItems/>
        </WidthWrraper>
    )
}

export default MainProductShow
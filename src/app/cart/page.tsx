import CartDetails from '@/components/CartDetails'
import WidthWrraper from '@/components/WidthWrraper'
import React from 'react'

function page() {
    return (
        <WidthWrraper className=' min-h-screen w-full bg-slate-100 py-8'>
            <CartDetails/>
        </WidthWrraper>
    )
}

export default page
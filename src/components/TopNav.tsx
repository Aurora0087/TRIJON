import React from 'react'
import WidthWrraper from './WidthWrraper'
import Image from 'next/image'
import BurgurManu from './BurgurManu'
import Link from 'next/link'
import IsLoginButton from './IsLoginButton'
import { Heart, ShoppingCart } from 'lucide-react'

function TopNav() {
    return (
        <WidthWrraper className=' py-3 border-b-2'>
            <div className=' flex justify-between'>
                <div className=' flex gap-12 justify-center items-center'>
                    <div>
                        <BurgurManu/>
                    </div>
                    <div className=' aspect-square w-8 h-8 overflow-hidden'>
                        <Link href={"/"}>
                            <Image src={'/assets/logo/BLACK.png'} alt='TRIJON' width={500} height={500}/>
                        </Link>
                    </div>
                </div>
                <div className=' hidden md:flex gap-6 justify-center items-center capitalize'>
                    <Link href='/shop/new'>New</Link>
                    <Link href='/shop/best'>Best sellers</Link>
                    <Link href='/shop/t-shirt'>t-shirts</Link>
                    <Link href='/shop/shirt'>shirts</Link>
                </div>
                <div className='flex gap-6 justify-center items-center capitalize'>
                    <IsLoginButton />
                    <Link href='/wishList'>
                    <Heart/>
                    </Link>
                    <Link href='/cart'>
                    <ShoppingCart/>
                    </Link>
                </div>
            </div>
        </WidthWrraper>
    )
}

export default TopNav
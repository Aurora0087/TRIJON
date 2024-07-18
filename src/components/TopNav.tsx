import React from 'react'
import WidthWrraper from './WidthWrraper'
import BurgurManu from './BurgurManu'
import IsLoginButton from './IsLoginButton'
import { Heart, ShoppingCart } from 'lucide-react'
import SearchForm from './SearchForm'

function TopNav() {
    return (
        <WidthWrraper className=' py-3 border-b-2'>
            <div className=' flex justify-between'>
                <div className=' flex gap-12 justify-center items-center'>
                    <div>
                        <BurgurManu />
                    </div>
                    <div className=' w-fit h-10 overflow-hidden'>
                        <a href="/" className='flex items-center gap-1 justify-center hover:text-blue-500'>
                            <div className=' w-10 h-10 grid place-content-center'>
                                <img src={'/assets/logo/BLACK.png'} alt='TRIJON' className='' />
                            </div>
                            <span id='logo' className=' w-full h-full grid place-content-center mt-[6px]'>TRIJON</span>
                        </a>
                    </div>
                </div>
                <div className=' hidden md:flex gap-6 justify-center items-center capitalize'>
                    <a href='/shop/new' className=' hover:text-blue-500'>New</a>
                    <a href='/shop/best' className=' hover:text-blue-500 line-clamp-1'>Best selling</a>
                    <a href='/shop/eimited edition' className=' hover:text-blue-500 line-clamp-1'>Limited Edition</a>
                    <SearchForm/>
                </div>
                <div className='flex gap-6 justify-center items-center capitalize'>
                    <IsLoginButton />
                    <a href='/wishList' className=' hover:text-blue-500'>
                        <Heart />
                    </a>
                    <a href='/cart' className=' hover:text-blue-500'>
                        <ShoppingCart />
                    </a>
                </div>
            </div>
        </WidthWrraper>
    )
}

export default TopNav
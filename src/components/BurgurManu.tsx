"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    SheetClose
} from './ui/sheet'

import {
    LifeBuoy,
    LogOut,
    Menu,
    Settings,
    Shirt,
    Star,
    Truck,
    User,
    X,
} from "lucide-react"
import Link from 'next/link'
import IsLogined from './isLogined'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SearchForm from './SearchForm'
import AdminWrapper from './AdminWrapper'

const categoryItems = [
    {
        name: "Best Seller",
        link: "/shop/best"
    },
    {
        name: "New Arrivel",
        link: "/shop/new"
    },
    {
        name: "Shirt",
        link: "/shop/shirt"
    },
    {
        name: "T-Shirt",
        link: "/shop/t-shirt"
    },
]

function BurgurManu() {

    const router = useRouter()

    async function handleSignOut() {
        await signOut().then(() => {
            router.push("/")
        })
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='p-0' variant="ghost">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className=' flex flex-col justify-between'>
                <div className=' border-b-2'>
                    <div className=' py-4'>
                    <SheetHeader className="mb-4">
                        <SheetTitle>Serch Cetegory</SheetTitle>
                    </SheetHeader>
                        <SearchForm/>
                    </div>
                    <SheetHeader>
                        <SheetTitle>Category</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-2 py-4 pl-4">
                        {
                            categoryItems.map((item) => (
                                <SheetClose asChild>
                                    <Link href={item.link} key={item.name} className='flex items-center space-x-2 hover:text-blue-500'>
                                        <Shirt className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </SheetClose>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <AdminWrapper>
                    <SheetClose asChild>
                                    <Link href="/dashbord" className='flex items-center space-x-2 text-red-400 hover:text-red-600'>
                                        <User className="h-4 w-4" />
                                        <span>Admin</span>
                                    </Link>
                                </SheetClose>
                    </AdminWrapper>
                </div>
                <div className='border-t-2'>
                    <SheetHeader className="mt-4">
                        <SheetTitle>My Account</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-2 py-4 pl-4">
                        <IsLogined>
                            <>
                                <SheetClose asChild>
                                    <Link href="/profile" className='flex items-center space-x-2 hover:text-blue-500'>
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/orders" className='flex items-center space-x-2  hover:text-blue-500'>
                                        <Truck className="h-4 w-4" />
                                        <span>Orders</span>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <button className='flex items-center space-x-2 p-0 hover:text-blue-500' onClick={handleSignOut}>
                                        <LogOut className="h-4 w-4" />
                                        <span>Log out</span>
                                    </button>
                                </SheetClose>
                            </>
                        </IsLogined>
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default BurgurManu
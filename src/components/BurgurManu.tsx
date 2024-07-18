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
    Notebook,
    Plus,
    Settings,
    Shirt,
    Star,
    Truck,
    User,
    User2,
    Users,
    X,
} from "lucide-react"
import Link from 'next/link'
import IsLogined from './isLogined'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SearchForm from './SearchForm'
import AdminWrapper from './AdminWrapper'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

import { FaTshirt } from 'react-icons/fa';
import { GiHoodie, GiMonclerJacket, GiUnderwearShorts, GiPirateCoat, GiBilledCap } from 'react-icons/gi';
import { RiRunLine } from 'react-icons/ri';
import { PiPants } from "react-icons/pi";
import { LuShirt } from "react-icons/lu";
import { motion } from 'framer-motion'

const categoryItems = [
    {
        name: "T-Shirt",
        link: "/shop/t-Shirt",
        icon: <FaTshirt className="h-4 w-4" />
    },
    {
        name: "Trackpant",
        link: "/shop/trackpant",
        icon: <PiPants className="h-4 w-4" />
    },
    {
        name: "Hoody",
        link: "/shop/hoody",
        icon: <GiHoodie className="h-4 w-4" />
    },
    {
        name: "Sweat Shirt",
        link: "/shop/Sweat-Shirt",
        icon: <GiMonclerJacket className="h-4 w-4" />
    },
    {
        name: "Shirt",
        link: "/shop/shirt",
        icon: <LuShirt className="h-4 w-4" />
    },
    {
        name: "Jogger",
        link: "/shop/jogger",
        icon: <RiRunLine className="h-4 w-4" />
    },
    {
        name: "Cap",
        link: "/shop/cap",
        icon: <GiBilledCap className="h-4 w-4" />
    },
    {
        name: "Boxer",
        link: "/shop/boxer",
        icon: <GiUnderwearShorts className="h-4 w-4" />
    },
    {
        name: "Blazer",
        link: "/shop/blazer",
        icon: <GiPirateCoat className="h-4 w-4" />
    },
    {
        name: "Cotton Pant",
        link: "/shop/cotton pant",
        icon: <PiPants className="h-4 w-4" />
    }
];

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
                <Button className='p-0 hover:text-blue-500' variant="ghost">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className=' flex flex-col justify-between'>
                <div className=' border-b-2 overflow-x-hidden'>
                    <div className=' py-2'>
                        <SheetHeader className="mb-2">
                            <SheetTitle>Search Category</SheetTitle>
                        </SheetHeader>
                        <SearchForm />
                    </div>
                    <SheetHeader>
                        <SheetTitle>Category</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 py-4 pl-4">
                        {categoryItems.map((item, index) => (
                            <SheetClose  key={index} asChild>
                                <Link href={item.link}>
                                    <motion.div
                                        className="flex items-center gap-2"
                                        whileHover={{ x: 5, color: "#3b82f6" }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </motion.div>
                                </Link>
                            </SheetClose>
                        ))}
                    </div>
                </div>
                <div>
                    <AdminWrapper>
                        <DropdownMenu>
                            <DropdownMenuTrigger className=' w-full text-end pr-2 text-blue-400'>
                                Admin
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=' w-full'>
                                <DropdownMenuLabel>Action</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <SheetClose asChild>
                                        <Link href="/dashbord/upload" className='flex items-center space-x-2 text-blue-400 hover:text-blue-600'>
                                            <Plus className="h-4 w-4" />
                                            <span>Add Product</span>
                                        </Link>
                                    </SheetClose>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SheetClose asChild>
                                        <Link href="/dashbord/products" className='flex items-center space-x-2'>
                                            <Notebook className="h-4 w-4" />
                                            <span>View Products</span>
                                        </Link>
                                    </SheetClose>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SheetClose asChild>
                                        <Link href="/dashbord/orders" className='flex items-center space-x-2'>
                                            <Truck className="h-4 w-4" />
                                            <span>View Orders</span>
                                        </Link>
                                    </SheetClose>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SheetClose asChild>
                                        <Link href="/dashbord/users" className='flex items-center space-x-2'>
                                            <Users className="h-4 w-4" />
                                            <span>View Users</span>
                                        </Link>
                                    </SheetClose>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                                        <span>Log Out</span>
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
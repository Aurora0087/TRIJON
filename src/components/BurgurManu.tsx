"use client"
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'

import {
    LifeBuoy,
    LogOut,
    Menu,
    Settings,
    Shirt,
    Star,
    User,
    X,
} from "lucide-react"
import Link from 'next/link'

const categoryItems = [
    {
        name: "Best Seller",
        link: "/category/Best Seller"
    },
    {
        name: "New Arrivel",
        link: "/category/New Arrivel"
    },
    {
        name: "Shirt",
        link: "/category/Shirt"
    },
    {
        name: "T-Shirt",
        link: "/category/T-Shirt"
    },
]

function BurgurManu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className=' p-0' variant="ghost">
                    <Menu />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {
                        categoryItems.map((item) => {
                            return (
                                <DropdownMenuItem key={item.name}>
                                    <Link href={item.link} className=' flex justify-center items-center'>
                                        <Shirt className="mr-2 h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </DropdownMenuItem>
                            )
                        })
                    }
                </DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default BurgurManu
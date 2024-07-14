"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation';

import React, { ReactNode, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronLeft, MoveRight } from 'lucide-react'

import { AnimatePresence, motion } from "framer-motion"

const navLinkItems = [
    {
        title: "New",
        href: "/shop/new"
    },
    {
        title: "BestSellers",
        href: "/shop/best"
    },
    {
        title: "Anime",
        href: "/shop/anime"
    },
    {
        title: "Trackpants",
        href: "/shop/trackpants"
    },
    {
        title: "Hoody",
        href: "/shop/hoody"
    },
    {
        title: "Sweat-Shirts",
        href: "/shop/Sweat-Shirts"
    },
    {
        title: "Shirts",
        href: "/shop/shirt"
    },
    {
        title: "Jogger",
        href: "/shop/jogger"
    },
    {
        title: "Boxer",
        href: "/shop/boxer"
    },
    {
        title: "Blazer",
        href: "/shop/blazer"
    },
    {
        title: "T-Shirt",
        href: "/shop/t-Shirt"
    },
    {
        title: "Casual Cap",
        href: "/shop/casual cap"
    },
    {
        title: "Winter Cap",
        href: "/shop/winter cap"
    },
    {
        title: "Sweat Shirts",
        href: "/shop/sweat shirts"
    },
    {
        title: "Cotton Pants",
        href: "/shop/cotton pants"
    }
];



function ShopSideBar() {

    const currentRoute = usePathname()
    return (
        <div
            className=' hidden md:grid relative w-[350px] border-r-2 bg-slate-200'>
            <div className=' sticky top-0 px-4 py-8 h-screen rounded-xl flex flex-col gap-1 font-semibold bg-white m-4 dark:bg-slate-900'>
            <NavLink link="/shop" name="All" isCurrnt={currentRoute==="/shop"} />
                {
                    navLinkItems.map((item, i) => {
                        return (
                            <NavLink key={i} link={(item.href)} name={item.title} isCurrnt={currentRoute.includes(item.href)} />
                        )
                    })
                }
            </div>
        </div>
    )
}

function NavLink({ link, name, isCurrnt }: { link: string, name: string, isCurrnt: Boolean }) {
    return (
        <Link className={`${isCurrnt ? "text-blue-500" : ""} rounded-md px-4 py-2 hover:bg-slate-200`} href={link}>
            {name}
        </Link>
    )
}

function CollapsibleCard({ triggerComponent, children }: { triggerComponent: string, children: ReactNode }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={toggleOpen} className='border-b border-blue-300'>
            <CollapsibleTrigger className='w-full flex gap-4 justify-between items-center cursor-pointer'>
                <h3 className="font-semibold rounded-md px-4 py-2 text-nowrap">{triggerComponent}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown />
                </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className='overflow-hidden'
                    >
                        <CollapsibleContent className='pb-2 flex flex-col pl-4 font-normal'>
                            {children}
                        </CollapsibleContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Collapsible>
    )

}

export default ShopSideBar
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation';

import React, { ReactNode, useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from 'lucide-react'

import { FaRegNewspaper, FaFire, FaTshirt } from 'react-icons/fa';
import { GiHoodie, GiMonclerJacket, GiUnderwearShorts, GiPirateCoat, GiBilledCap, GiWinterHat } from 'react-icons/gi';
import { RiRunLine } from 'react-icons/ri';
import { PiPants } from "react-icons/pi";
import { LuShirt } from "react-icons/lu";

import { AnimatePresence, motion } from "framer-motion"

const navLinkItems = [
    { title: "T-Shirt", href: "/shop/t-Shirt", icon: <FaTshirt className="h-4 w-4" /> },
    { title: "Trackpant", href: "/shop/trackpant", icon: <PiPants className="h-4 w-4" /> },
    { title: "Hoody", href: "/shop/hoody", icon: <GiHoodie className="h-4 w-4" /> },
    { title: "Sweat Shirt", href: "/shop/sweat shirt", icon: <GiMonclerJacket className="h-4 w-4" /> },
    { title: "Shirt", href: "/shop/shirt", icon: <LuShirt className="h-4 w-4" /> },
    { title: "Jogger", href: "/shop/jogger", icon: <RiRunLine className="h-4 w-4" /> },
    { title: "Boxer", href: "/shop/boxer", icon: <GiUnderwearShorts className="h-4 w-4" /> },
    { title: "Blazer", href: "/shop/blazer", icon: <GiPirateCoat className="h-4 w-4" /> },
    { title: "Casual Cap", href: "/shop/casual cap", icon: <GiBilledCap className="h-4 w-4" /> },
    { title: "Winter Cap", href: "/shop/winter cap", icon: <GiWinterHat className="h-4 w-4" /> },
    { title: "Cotton Pant", href: "/shop/cotton pant", icon: <PiPants className="h-4 w-4" /> }
];

function ShopSideBar() {
    const currentRoute = decodeURIComponent(usePathname().toLowerCase())

    return (
        <div className='hidden md:grid relative w-[350px] border-r-2 bg-slate-200'>
            <div className='sticky top-0 px-4 py-8 h-screen rounded-xl flex flex-col gap-1 font-semibold bg-white m-4 dark:bg-slate-900'>
                <NavLink link="/shop" name="All" isCurrnt={currentRoute === "/shop"} icon={undefined} />
                {navLinkItems.map((item, i) => (
                    <NavLink 
                        key={i} 
                        link={item.href.toLowerCase()} // Convert href to lowercase for case-insensitive comparison
                        name={item.title} 
                        isCurrnt={currentRoute.includes(item.href.toLowerCase())} 
                        icon={item.icon} 
                    />
                ))}
            </div>
        </div>
    )
}

function NavLink({ link, name, isCurrnt, icon }: { link: string, name: string, isCurrnt: boolean, icon: ReactNode }) {

    return (
        <Link href={link}>
            <motion.div 
                className={` flex items-center gap-2 rounded-md px-4 py-2 bg-white`}
                animate={{ 
                    color: isCurrnt ? "#3b82f6" : "black", 
                    x: isCurrnt ? 5 : 0 
                }}
                whileHover={{ x: 10, backgroundColor: "#111827",color: "white"}}
                transition={{ type: "spring", stiffness: 200 }}
            >
                {icon}
                {name}
            </motion.div>
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

export default ShopSideBar;

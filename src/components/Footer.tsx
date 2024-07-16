"use client"

import { ChevronDown, Facebook, Instagram, Linkedin, Mail, Phone, RotateCcw, Truck, Twitter, Youtube } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa"
import { RiTwitterXLine } from "react-icons/ri"
import React, { ReactNode, useState } from 'react'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { AnimatePresence, motion } from 'framer-motion';

function Footer() {
    return (
        <footer id='footer' className="bg-gray-900 text-gray-300 py-10">
            <div className="container mx-auto px-4">
                <div className="grid  gap-8 md:grid-cols-4 mb-8">
                    <div className="flex items-center">
                        <Truck className="w-6 h-6 mr-2" />
                        <span>Delivery</span>
                    </div>
                    <div className="flex items-center">
                        <RotateCcw className="w-6 h-6 mr-2" />
                        <span>Returns</span>
                    </div>
                    <div className="flex items-center">
                        <FaWhatsapp className="w-6 h-6" />
                        <span className=' ml-2'>+91 8942974275</span>
                    </div>
                    <div className="flex items-center">
                        <Mail className="w-6 h-6 mr-2" />
                        <span>info@trijoncreation.in</span>
                    </div>
                </div>

                {/* Main footer content */}
                <div className=" hidden md:grid grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-white mb-4">Payment Method</h3>
                        <ul className="space-y-2">
                            <li>Pay on Delivery</li>
                            <li>Pay online</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Category</h3>
                        <ul className="space-y-2">
                            <li><a href="/shop/trackpants">Summer Sale</a></li>
                            <li><a href="/shop/trackpants">Winter Sale</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">About company</h3>
                        <ul className="space-y-2">
                            <li>About Us</li>
                            <li>Contacts</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Social networks</h3>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/trijon.in" target="_blank">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/trijon.in" target="_blank">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://twitter.com/TrijonIN" target="_blank">
                                <RiTwitterXLine className="w-6 h-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/tis-group-and-company-7a3b55315/" target="_blank">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className='grid gap-4 md:hidden text-white'>
                    <CollapsibleCard triggerComponent="For buyers">
                        <ul className="space-y-2 pb-4">
                            <li>Payment</li>
                            <li>Personal data policy</li>
                        </ul>
                    </CollapsibleCard>
                    <CollapsibleCard triggerComponent="Category">
                        <ul className="space-y-2 pb-4">
                            <li><a href="/shop/trackpants">Summer Sale</a></li>
                            <li><a href="/shop/trackpants">Winter Sale</a></li>
                        </ul>
                    </CollapsibleCard>
                    <div>
                        <h3 className="font-bold text-white mb-4">Social networks</h3>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/trijon.in" target="_blank">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/trijon.in" target="_blank">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://twitter.com/TrijonIN">
                                <RiTwitterXLine className="w-6 h-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/tis-group-and-company-7a3b55315/" target="_blank">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
                {/* Copyright */}
                <div className="mt-8 text-sm w-full grid place-content-center">
                    <p>&copy; 2024 TRIJON</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

function CollapsibleCard({ triggerComponent, children }: { triggerComponent: string, children: ReactNode }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={toggleOpen} className=' border-b'>
            <CollapsibleTrigger className=' w-full flex gap-4 justify-between '>
                <h3 className="font-bold mb-4">{triggerComponent}</h3>
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
                        <CollapsibleContent>
                            {children}
                        </CollapsibleContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Collapsible>
    )

}

export default Footer
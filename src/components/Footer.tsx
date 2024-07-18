"use client"

import { ChevronDown, Facebook, Instagram, Linkedin, Mail, Phone, RotateCcw, Truck, Twitter, Youtube } from 'lucide-react';
import { FaFacebook, FaWhatsapp } from "react-icons/fa"
import { RiTwitterXLine } from "react-icons/ri"
import React, { ReactNode, useState } from 'react'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { AnimatePresence, motion } from 'framer-motion';

const facebookPageId = '361122133747842'
const fallbackUrl = 'https://www.facebook.com/share/Geqdk99gyv4AaEW2/?mibextid=LQQJ4d';
function Footer() {
    return (
        <footer id='footer' className="bg-gray-900 text-gray-300 py-10">
            <div className="container mx-auto px-4">
                <div className="grid  gap-2 md:grid-cols-4 mb-8">
                    <div className="flex items-center">
                        <Truck className="w-6 h-6 mr-2" />
                        <span>Delivery</span>
                    </div>
                    <div className="flex items-center">
                        <RotateCcw className="w-6 h-6 mr-2" />
                        <span>Returns</span>
                    </div>
                    <a
                        href="https://wa.me/918942974275"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-green-400"
                    >
                        <FaWhatsapp className="w-6 h-6" />
                        <span className='ml-2'>+91 8942974275</span>
                    </a>
                    <a
                        href="mailto:info@trijoncreation.in"
                        className="flex items-center hover:text-blue-500"
                    >
                        <Mail className="w-6 h-6 mr-1" />
                        <span>info@trijoncreation.in</span>
                    </a>
                </div>
                {/* Main footer content */}
                <div className=" hidden md:grid grid-cols-4 gap-2">
                    <div>
                        <h3 className="font-bold text-white mb-4">About TRIJON</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className=' hover:text-blue-400'>About Us</a></li>
                            <li><a href="/contacts" className=' hover:text-green-400'>Contacts</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Social Networks</h3>
                        <div className="flex space-x-4">
                            <FacebookLink />
                            <a href="https://www.instagram.com/trijon.in" target="_blank" className=' hover:text-red-400'>
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://twitter.com/TrijonIN" className=' hover:text-blue-500'>
                                <RiTwitterXLine className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Category</h3>
                        <ul className="space-y-2">
                            <li className=' hover:text-blue-500'><a href="/shop/trackpants">Summer Sale</a></li>
                            <li className=' hover:text-blue-500'><a href="/shop/trackpants">Winter Sale</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Payment Method</h3>
                        <ul className="space-y-2">
                            <li>Pay on Delivery</li>
                            <li>Pay online</li>
                        </ul>
                    </div>
                </div>
                <div className='grid gap-4 md:hidden text-white'>
                    <div>
                        <h3 className="font-bold text-white mb-4">Social networks</h3>
                        <div className="flex space-x-4">
                            <FacebookLink />
                            <a href="https://www.instagram.com/trijon.in" target="_blank" className=' hover:text-red-400'>
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://twitter.com/TrijonIN" className=' hover:text-blue-500'>
                                <RiTwitterXLine className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                    <CollapsibleCard triggerComponent="About TRIJON">
                        <ul className="space-y-2 pb-4">
                            <li><a href="/about" className=' hover:text-blue-400'>About Us</a></li>
                            <li><a href="/contacts" className=' hover:text-green-400'>Contacts</a></li>
                        </ul>
                    </CollapsibleCard>
                    <CollapsibleCard triggerComponent="Category">
                        <ul className="space-y-2 pb-4">
                            <li className=' hover:text-blue-500'><a href="/shop/trackpants">Summer Sale</a></li>
                            <li className=' hover:text-blue-500'><a href="/shop/trackpants">Winter Sale</a></li>
                        </ul>
                    </CollapsibleCard>
                    <CollapsibleCard triggerComponent="Payment Method">
                        <ul className="space-y-2 pb-4">
                            <li>Pay on Delivery</li>
                            <li>Pay online</li>
                        </ul>
                    </CollapsibleCard>
                    <CollapsibleCard triggerComponent="Category">
                        <ul className="space-y-2 pb-4">
                            <li><a href="/shop/trackpants">Summer Sale</a></li>
                            <li><a href="/shop/trackpants">Winter Sale</a></li>
                        </ul>
                    </CollapsibleCard>

                </div>
                {/* Copyright */}
                <div className="mt-8 text-sm w-full flex flex-col md:flex-row justify-center items-center gap-x-2">
                    <p>Copyright © TRIJON.</p>
                    <p> All Rights Reserved.</p>
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

export function FacebookLink() {
    const handleFacebookLinkClick = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        const appUrl = `fb://page/${facebookPageId}`;
        const timeout = setTimeout(() => {
            window.location.href = fallbackUrl;
        }, 500)

        window.location.href = appUrl;

        window.addEventListener('blur', () => clearTimeout(timeout));
    };

    return (
        <a href={fallbackUrl} onClick={handleFacebookLinkClick} target="_blank" className=' hover:text-blue-500'>
            <FaFacebook className="w-6 h-6" />
        </a>
    );
}

export default Footer
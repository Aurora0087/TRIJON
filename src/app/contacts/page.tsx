"use client"

import BackButton from '@/components/BackButton';
import { FacebookLink } from '@/components/Footer';
import TextRevealOnScroll from '@/components/TextRevealOnScroll';
import WidthWrraper from '@/components/WidthWrraper';
import { motion } from 'framer-motion';
import { Instagram, Mail } from 'lucide-react';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { RiTwitterLine, RiTwitterXLine } from 'react-icons/ri';

const ContactsPage: React.FC = () => {
    return (
        <WidthWrraper className='py-8 min-h-svh flex flex-col gap-4 bg-slate-100'>
            <div className='w-fit'>
                <BackButton />
            </div>
            <div className='flex flex-col gap-2 text-xl'>
                <div className='overflow-hidden relative w-fit'>
                    <motion.h1
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className='font-semibold text-5xl mb-8 text-blue-500'>Contact Us :</motion.h1>
                </div>
                <div className='p-10 flex flex-col gap-10'>
                    <div className=' overflow-hidden text-slate-500'>
                        <TextRevealOnScroll
                            text="For any queries, feel free to contact us at info@trijoncreation.in or fill out the form below."
                            fontSize="48px"
                        />
                    </div>
                    <div className=' grid md:grid-cols-2 gap-4 md:gap-y-8 p-4'>
                        <div className=' overflow-hidden'>
                            <motion.a
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                href="https://wa.me/918942974275"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center hover:text-green-500 w-fit"
                            >
                                <FaWhatsapp className="w-6 h-6" />
                                <span className='ml-2'>+91 8942974275</span>
                            </motion.a>
                        </div>
                        <div className=' overflow-hidden'>
                            <motion.a
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                href="mailto:info@trijoncreation.in"
                                className="flex items-center hover:text-blue-500  w-fit"
                            >
                                <Mail className="w-6 h-6 mr-1" />
                                <span>info@trijoncreation.in</span>
                            </motion.a>
                        </div>
                        <div className=' overflow-hidden'>
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                className=' flex items-center  hover:text-blue-500  w-fit'>
                                <FacebookLink />
                                <span className=' ml-1'>TRIJON.in</span>
                            </motion.div>
                        </div>
                        <div className=' overflow-hidden'>
                            <motion.a
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                href="https://www.instagram.com/trijon.in" target="_blank"
                                className="flex items-center hover:text-red-400  w-fit"
                            >
                                <Instagram className="w-6 h-6 mr-1" />
                                <span>trijon.in</span>
                            </motion.a>
                        </div>
                        <div className=' overflow-hidden'>
                            <motion.a
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                                href="https://twitter.com/TrijonIN" target="_blank"
                                className="flex items-center hover:text-blue-500 w-fit"
                            >
                                <RiTwitterXLine className="w-6 h-6 mr-1" />
                                <span>@TrijonIN</span>
                            </motion.a>
                        </div>

                    </div>
                </div>
            </div>
        </WidthWrraper>
    );
};

export default ContactsPage;


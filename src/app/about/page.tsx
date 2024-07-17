"use client"
import BackButton from '@/components/BackButton'
import TextRevealOnScroll from '@/components/TextRevealOnScroll'
import WidthWrraper from '@/components/WidthWrraper'
import { motion } from 'framer-motion'
import React from 'react'

function AboutPage() {
    return (
        <WidthWrraper className=' py-8 min-h-svh flex flex-col gap-4 bg-slate-100'>
            <div className=' w-fit'>
                <BackButton />
            </div>
            <div className=' flex flex-col gap-2 text-xl'>
                <div className=' overflow-hidden relative w-fit'>
                    <motion.h1
                        initial={{x:'-100%'}}
                        animate={{ x: 0 }}
                        transition={{type: "spring", stiffness: 500 }}
                        className=' font-semibold text-6xl mb-8 text-blue-500'>About TRIJON :</motion.h1>
                </div>
                <div className=' p-10 flex flex-col gap-8'>
                    <div className=' pl-2 overflow-hidden'>
                    <TextRevealOnScroll
                        text="          Refresh your clothing with the awesome collection of Round Neck Tees from TRIJON. These t shirts are made of 100% - Bio wash Cotton and make a comfort wear for all seasons. The feel of the fabric keeps you comfortable even at high humid conditions. Pair it with Cotton Trousers or Denims for a perfect weekend wear."
                        fontSize="60px"
                    />
                </div>
                <div className=' pl-2 overflow-hidden text-slate-600 text-xl'>
                <TextRevealOnScroll
                        text="          TRIJON offers quality casual wear in the widest variety which makes it easy to choose. Fall in love with the soft texture of the fabric wearing this plain solid t-shirt, has a collar type & sleeves types slim-fit t-shirt by TRIJON. Hook up with comfort and roll with time as you adorn this t-shirt fashioned using cotton pique. work hard and play harder as you party through the night in this utterly comfortable t-shirt."
                        fontSize="60px"
                    />
                </div>
                </div>
                
            </div>
        </WidthWrraper>
    )
}

export default AboutPage
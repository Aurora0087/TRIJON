import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'

function Hero() {
    return (
            <div className="relative py-8 bg-slate-200">
                <div className=" w-full lg:grid lg:grid-cols-2 lg:gap-8">
                    <div className="relative h-full mx-3 mt-12 lg:mt-0 sm:rounded-3xl lg:rounded-none lg:rounded-tr-[50%] overflow-hidden lg:mx-0 lg:col-span-1">
                        <Image
                            className="relative object-cover w-full h-full"
                            src="/assets/image/hero.jpg"
                        alt="Couple wearing TRIJON clothes"
                        width={5000}
                        height={5000}
                        />
                    </div>
                    <div className="mx-auto max-w-md px-4 py-16 sm:max-w-2xl sm:px-6 sm:py-24 lg:flex lg:items-center lg:px-0 lg:py-32">
                        <div className="lg:py-24">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">Refresh your clothing</span>
                                <span className="block text-indigo-600">with TRIJON</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                Explore the awesome collection by TRIJON.
                            </p>
                            <div className="mt-10 sm:mt-12">
                                <a
                                    href="/shop"
                            >
                                <Button className=' rounded-full'>
                                    Shop Now
                                </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Hero
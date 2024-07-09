import React from 'react'
import WidthWrraper from './WidthWrraper'
import { Input } from './ui/input'
import { Button } from './ui/button'

function Newsletter() {
    return (
        <WidthWrraper className='w-full grid place-content-center py-12'>
            <div className=' flex gap-8 flex-col md:flex-row justify-center items-center'>
                <h2 className="text-2xl font-extrabold">Subscribe to our Newsletter</h2>
                <div className=' flex gap-4'>
                    <Input className=' rounded-full' placeholder='Enter Your Email' />
                    <Button className=' rounded-full'>Subscribe</Button>
                </div>
            </div>
        </WidthWrraper>
    )
}

export default Newsletter
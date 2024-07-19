"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { MoveLeft } from 'lucide-react'

function BackButton() {

    const route = useRouter()
    return (
        <button onClick={()=>route.back()} className='h-10 px-4 py-2 rounded-full flex gap-4 items-center'>
            <MoveLeft />
            <span className=' hidden md:grid'>Go back</span>
        </button>
    )
}

export default BackButton
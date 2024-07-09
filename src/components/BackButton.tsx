"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { MoveLeft } from 'lucide-react'

function BackButton() {

    const route = useRouter()
    return (
        <Button onClick={()=>route.back()} className=' rounded-full flex gap-4 items-center'>
            <MoveLeft />
            <span className=' hidden md:grid'>Go back</span>
        </Button>
    )
}

export default BackButton
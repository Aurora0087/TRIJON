"use client"

import React, { useEffect, useState } from 'react'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User } from 'next-auth'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



function IsLoginButton() {

    const [user, setUser] = useState<User | null | undefined>(null)

    const router = useRouter()

    useEffect(() => {
        fatchUser()
    }, [])

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    async function handleGoogleSignIn() {
        await signIn('google', {
        }).then((res) => {
            router.push("/")
        })
    }

    async function handleSignOut() {
        await signOut().then(() => {
            setUser(null)
            router.push("/")
        })
    }

    return (
        <div>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className=' border-2 hover:border-blue-400'>
                            <AvatarImage src={user.image!} />
                            <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            My Account
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/profile">
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <button onClick={handleGoogleSignIn} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        login
                    </span>
                </button>
            )}
        </div>
    )
}

export default IsLoginButton
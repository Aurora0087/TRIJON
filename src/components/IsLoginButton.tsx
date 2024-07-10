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
import { Button } from './ui/button'



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
                <Button onClick={handleGoogleSignIn} className=' rounded-full'>
                        Login
                </Button>
            )}
        </div>
    )
}

export default IsLoginButton
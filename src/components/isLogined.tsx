"use client"

import React, { useEffect, useState } from 'react'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User } from 'next-auth'

import { Button } from './ui/button'



function IsLogined(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {

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

    return (
        <>
            {user ? (
                <>
                    {children}
                </>
            ) : (
                <Button onClick={handleGoogleSignIn} className=' rounded-full'>
                    Login
                </Button>
            )}
        </>
    )
}

export default IsLogined
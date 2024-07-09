"use client"

import { User } from 'next-auth';
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

function AdminWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [user, setUser] = useState<User | null | undefined>(null)

    useEffect(() => {
        fatchUser()
        console.log(user);
    }, [])

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    return (
        <>
            {
                user ? (
                    <div className="flex bg-slate-200 min-h-svh w-full relative" >
                        {children}
                    </div>
                ) : (
                        <div className=' w-full h-full grid place-content-center'>
                            <h1 className=' font-semibold text-red-500'>Please Login for viewing this page...</h1>
                    </div>
                )
            }
        </>
    )
}

export default AdminWrapper
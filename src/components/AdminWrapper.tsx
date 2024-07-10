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
    const [isAdmin,setIsAdmin] = useState(false)

    useEffect(() => {
        fatchUser()
        setIsAdmin(findIsAdmin())
    }, [])

    useEffect(() => {
        setIsAdmin(findIsAdmin())
    }, [user])

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    function findIsAdmin() {
        return user?.role === "ADMIN"
    }

    return (
        <>
            {
                isAdmin ? (
                    <>
                    { children }
                    </>
                    
                ) : (
                    null
                )
            }
        </>
    )
}

export default AdminWrapper
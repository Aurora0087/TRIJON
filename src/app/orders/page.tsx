"use client"

import BackButton from '@/components/BackButton'
import OrderCard from '@/components/card/OrderCard'
import WidthWrraper from '@/components/WidthWrraper'
import { getOrdersPayedByUser } from '@/database/action/order.action'
import { getImageUrl } from '@/database/aws/s3/Utils'
import { User } from 'next-auth'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function WatchOrders() {

    const [orders, setOrders] = useState<any[]>([])

    const [user, setUser] = useState<User | null | undefined>(null)

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    async function getOrders() {
        if (user === null || user === undefined) {
            return
        }
        await getOrdersPayedByUser({ email: user.email as string }).then(async (res) => {
            setOrders(res.orders);
            console.log(res.orders);
            
        });
    }

    useEffect(() => {
        fatchUser()
    }, []);

    useEffect(() => {
        getOrders();
    }, [user]);

    return (
        <WidthWrraper className=' min-h-screen w-full bg-slate-100 py-8'>
            <div className=' flex flex-col'>
                <div><BackButton /></div>
                <h2 className="text-2xl font-extrabold py-2">Your Orders</h2>
                <div className="w-full grid gap-4">
                {orders.length > 0 ? (
                    orders.map((order, i) => (
                        <OrderCard key={i} order={order} />
                    ))
                ) : (
                    <div className="w-full h-full grid place-content-center font-semibold text-slate-600">
                        No orders found.
                    </div>
                )}
            </div>
            </div>
        </WidthWrraper>
    )
}

export default WatchOrders
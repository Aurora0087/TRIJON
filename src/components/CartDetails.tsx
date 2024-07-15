"use client"

import React, { useEffect, useState } from 'react'
import BackButton from './BackButton'
import CartCard from './card/CartCard'
import DeliveryForm from './DeliveryForm'
import { getSession } from 'next-auth/react'
import { User } from 'next-auth'
import { getCartItemsByEmail } from '@/database/action/cart.action'

function CartDetails() {

    const [cartItems, setCartItems] = useState([])
    const [totalGoodsPrice, setTotalGoodsPrice] = useState(0)
    const [user, setUser] = useState<User | null | undefined>(null)
    const [loading, setLoading] = useState(true)

    async function fetchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    async function getItems() {
        if (!user) return
        setLoading(true)
        try {
            const res = await getCartItemsByEmail({ email: user.email as string })
            setCartItems(res.products)
            calculateTotalPrice(res.products)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    function calculateTotalPrice(products: any[]) {
        const total = products.reduce((sum, product) => {
            return sum + product.price
        }, 0)
        setTotalGoodsPrice(total)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        getItems()
    }, [user])

    return (
        <div className='flex flex-col'>
            <div><BackButton /></div>
            <h2 className="text-2xl font-extrabold">Your Cart</h2>
            {loading ? (
                <div className='w-full h-full grid place-content-center font-semibold text-slate-600'>
                    Loading...
                </div>
            ) : cartItems.length > 0 ? (
                <div className='flex gap-2 md:flex-row flex-col'>
                    <div className='flex flex-col gap-4 flex-grow'>
                        {cartItems.map((data: {
                            _id: string
                            productId: { _id: string; imageList: string[]; title: string }
                            price: number
                            color: string
                            size: string
                            quantity: number
                        }, i: React.Key | null | undefined) => (
                            <CartCard
                                key={i}
                                id={data._id}
                                productId={data.productId._id}
                                imageSrc={data.productId.imageList[0]}
                                productName={data.productId.title}
                                price={data.price}
                                color={data.color}
                                size={data.size}
                                quantity={data.quantity}
                                afterDelete={getItems}
                            />
                        ))}
                    </div>
                    <div className='w-full md:w-fit'>
                        <DeliveryForm afterPayment={getItems} goodsCost={totalGoodsPrice} discont={0} deliveryCost={0} />
                    </div>
                </div>
            ) : (
                <div className='w-full h-full grid place-content-center font-semibold text-slate-600'>
                    Your Cart is empty.
                </div>
            )}
        </div>
    )
}

export default CartDetails

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
    const [costOfGoods, setCostOfGoods] = useState(0)
    const [tax, setTax] = useState(0)
    const [packaging, setPackaging] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [orderSummary, setOrderSummary] = useState(0)
    const [delivery,setDelivery] = useState(0)
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
            setCostOfGoods(res.costOfGoods)
            setTax(res.tax)
            setPackaging(res.packaging)
            setDiscount(res.discount)
            setOrderSummary(res.orderSummary)
            setDelivery(res.deliveryCharges)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
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
                        <DeliveryForm afterPayment={getItems} costOfGoods={costOfGoods} tax={tax} packaging={packaging} orderSummary={orderSummary} discount={discount} deliveryCost={delivery} />
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

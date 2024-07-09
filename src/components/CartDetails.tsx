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

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    async function getItems() {
        if (user === null || user === undefined) {
            return
        }
        await getCartItemsByEmail({ email: user?.email as string }).then((res) => {
            setCartItems(res.products)
            console.log(res.products);
            
            calculateTotalPrice(res.products);
        })
    }

    function calculateTotalPrice(products: any[]) {
        const total = products.reduce((sum, product) => {
            return sum + (product.price);
        }, 0);
        setTotalGoodsPrice(total);
    }
    

    useEffect(() => {
        fatchUser()
    }, [])

    useEffect(() => {
        getItems()
    }, [user])

    return (
        <div className=' flex flex-col'>
            <div><BackButton /></div>
            <h2 className="text-2xl font-extrabold">Your Cart</h2>
            {cartItems.length > 0 ? (<div className=' flex gap-2 md:flex-row flex-col'>
                <div className=' flex flex-col gap-4 flex-grow'>
                    {
                        cartItems.map((data: {
                            _id: string, productId: { _id: string; imageList: string[]; title: string }; price: number; color: string; size: string; quantity: number }, i: React.Key | null | undefined) => {
                            return (
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
                            )
                        })
                    }
                </div>
                <div className=' w-full md:w-fit'>
                    <DeliveryForm afterPayment={getItems} goodsCost={totalGoodsPrice} discont={0} deliveryCost={0} />
                </div>
            </div>
            )
                : (
                    <div className=' w-full h-full grid place-content-center font-semibold text-slate-600'>
                        Your Cart is empty.
                    </div>
                )
            }
        </div>
    )
}

export default CartDetails
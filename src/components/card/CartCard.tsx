"use client"

import React from 'react'
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { deleteCartItems } from '@/database/action/cart.action';
import { useToast } from '../ui/use-toast';
import { Toaster } from '../ui/toaster';

interface CartCardProps {
    id: string;
    productId: string;
    imageSrc: string;
    productName: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
    afterDelete: () => void
}

function CartCard(
    {
        id,
        productId,
        imageSrc,
        productName,
        price,
        color,
        size,
        quantity,
        afterDelete
    }: CartCardProps
) {

    const { toast } = useToast()


    async function onRemove() {
        await deleteCartItems({ itemId: id }).then((res) => {

            afterDelete()

            toast({
                description: "Added to cart.",
            })
        }).catch((e) => {
            toast({
                title: "Error",
                description: String(e),
            })
        })
    }
    return (
        <div className="flex items-center border-b border-gray-200 p-4 w-full">
            <div className=' overflow-hidden rounded-lg'>
                <Image src={imageSrc} alt={productName} width={5000} height={5000} className="w-20 h-28 object-cover mr-4" />
            </div>
            <Toaster />
            <div className=' flex gap-4 justify-between w-full'>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{productName}</h3>
                    <p className="text-gray-600">₹ {price}</p>
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Color: {color}</p>
                        <p className="text-sm text-gray-600">Size: {size}</p>
                        <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    </div>
                </div>
                <Button
                    variant='outline'
                    onClick={onRemove}
                    className="text-gray-500 hover:text-red-500">
                    <Trash2 size={20} />
                </Button>
            </div>

        </div>
    )
}

export default CartCard
"use client"

import React, { ReactNode, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';

interface IProduct {
    _id: string;
    title: string;
    imageUrl: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    deliveryStatus: string;
}

interface IOrder {
    _id: string;
    city: string;
    houseNumber: string;
    landmark: string;
    isPaid: boolean;
    pincode: string;
    state: string;
    street: string;
    fullName: string;
    mobileNumber: string;
    costOfGoods: number;
    tax: number;
    packaging: number;
    deliveryCharges: number;
    discount: number;
    orderSummary: number;
    products: IProduct[];
    createdAt: string;
    paymentMethod: string;
}

interface OrderCardProps {
    order: IOrder;
}

function OrderCard({ order }: OrderCardProps) {

    const [paymentMethod, setPaymentMethod] = useState("Pay on Delivery");

    useEffect(() => {
        if (order.paymentMethod === "RAZORPAY") {
            setPaymentMethod("Online");
        }
    }, [order.paymentMethod]);

    return (
        <div className="p-4 bg-white shadow-md rounded-md mt-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-auto">
                <h3 className="text-lg font-bold mb-2">Order ID: {order._id}</h3>
                <p className="text-sm mb-1 font-semibold text-slate-500">Full Name: {order.fullName}</p>
                <p className="text-sm mb-1 font-semibold text-slate-500">Mobile: {order.mobileNumber}</p>
                <p className="text-sm mb-1 font-semibold text-slate-500">Total Price: ₹{order.orderSummary}</p>
                <p className="text-sm mb-1 font-semibold text-slate-500">Payment Method: {paymentMethod}</p>
                <p className="text-sm mb-1 font-semibold text-slate-500">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                
                <div className="my-4">
                    <p className="text-sm mb-1 font-semibold text-slate-500">Cost of Goods: ₹{order.costOfGoods}</p>
                    <p className="text-sm mb-1 font-semibold text-slate-500">Tax: ₹{order.tax}</p>
                    <p className="text-sm mb-1 font-semibold text-slate-500">Packaging: ₹{order.packaging}</p>
                    <p className="text-sm mb-1 font-semibold text-slate-500">Delivery Charges: ₹{order.deliveryCharges}</p>
                    <p className="text-sm mb-1 font-semibold text-slate-500">Discount: ₹{order.discount}</p>
                </div>
                
                <div className='rounded-lg p-2 border-2 border-blue-400 my-2'>
                    <p className="text-sm mb-1 font-semibold text-slate-500 flex items-center"><MapPin className='mr-2' />Address:</p>
                    <p className="text-sm mb-1 text-slate-500">{order.houseNumber}, {order.street}</p>
                    {order.landmark && <p className="text-sm mb-1 text-slate-500">Landmark: {order.landmark}</p>}
                    <p className="text-sm mb-1 text-slate-500">{order.city}, {order.state} - {order.pincode}</p>
                </div>
            </div>

            <div className='w-full md:w-auto'>
                <CollapsibleCard triggerComponent='Products:'>
                    <div className='p-2 grid md:grid-cols-3 gap-4'>
                        {order.products.map((product, i) => (
                            <div key={i} className="flex p-2 gap-2 bg-slate-200 rounded-xl w-full md:w-fit">
                                <a href={`/shop/product/${product._id}`} className='rounded-xl overflow-hidden border-2 md:max-w-[350px]'>
                                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                </a>
                                <div className='flex flex-col p-2 gap-2 rounded-xl bg-white w-fit'>
                                    <p className="text-xl font-semibold">{product.title}</p>
                                    <p className="text-sm flex gap-2">
                                        <span className='px-2 font-medium text-slate-500'>Color:</span>
                                        {product.color}
                                    </p>
                                    <p className="text-sm flex gap-2">
                                        <span className='px-2 font-medium text-slate-500'>Size:</span>
                                        {product.size}
                                    </p>
                                    <p className="text-sm flex gap-2">
                                        <span className='px-2 font-medium text-slate-500'>Quantity:</span>
                                        {product.quantity}
                                    </p>
                                    <p className="text-sm flex gap-2">
                                        <span className='px-2 font-medium text-slate-500'>Price:</span>
                                        ₹{product.price}
                                    </p>
                                    <p className="text-sm grid gap-2">
                                        <span className='px-2 font-medium text-slate-500'>Delivery Status:</span>
                                        <Badge className='w-fit ml-2 text-black'>
                                            {product.deliveryStatus}
                                        </Badge>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>
            </div>
        </div>
    )
}

function CollapsibleCard({ triggerComponent, children }: { triggerComponent: string, children: ReactNode }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={toggleOpen} className='border-b'>
            <CollapsibleTrigger className='w-full flex gap-4 justify-between'>
                <h3 className="font-bold mb-4">{triggerComponent}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown />
                </motion.div>
            </CollapsibleTrigger>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className='overflow-hidden'
                    >
                        <CollapsibleContent>
                            {children}
                        </CollapsibleContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Collapsible>
    ) 
}

export default OrderCard;

"use client"

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import WidthWrraper from '@/components/WidthWrraper';
import { getOrderById, changeOrderedProductsStatus } from '@/database/action/order.action';
import { IOrder } from '@/database/models/order.model';
import { SearchParamProps } from '@/types'
import { MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { getRazorpayOrderDetails } from '@/database/action/razorpayOrder.action';

function Page({ params: { id } }: SearchParamProps) {
    
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [razorpay,setRezorpay] = useState(null)
    const { toast } = useToast();

    const fetchOrderDetails = async () => {
        try {
            const fetchedOrder = await getOrderById({ orderId: id });
            if (fetchedOrder) {
                setOrder(fetchedOrder);
            } else {
                setError('Order does not exist');
            }
        } catch (error) {
            setError('Error fetching order details');
            toast({
                description: `${String(error)}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchRazorpayDetails = async () => {
        const fetchedRazerpay = await getRazorpayOrderDetails({ orderId: id })
        if (fetchedRazerpay) {
            setRezorpay(fetchedRazerpay.razorpayPaymentId)
        } else {
            setRezorpay(null)
        }
    }

    const handleChangeStatus = async (orderId: string, productId: string, statusType: string) => {
        try {
            await changeOrderedProductsStatus({ orderId, productId, statusType });
            toast({
                description: 'Product status updated successfully',
            });
            fetchOrderDetails(); // Refetch order details to reflect the changes
        } catch (error) {
            toast({
                description: `Error updating product status: ${String(error)}`,
            });
        }
    };

    useEffect(() => {
        fetchOrderDetails()
        fetchRazorpayDetails()
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-slate-100 shadow-md rounded-lg">
            <div className=' py-4'>
                <BackButton/>
            </div>
            <Toaster />
            {order ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Order Details</h1>
                    <p className="mb-2"><strong>Order ID:</strong> {order._id}</p>
                    <p className="mb-2"><strong>Full Name:</strong> {order.fullName}</p>
                    <p className="mb-2"><strong>Mobile Number:</strong> {order.mobileNumber}</p>
                    <p className="mb-2"><strong>Address:</strong> {order.houseNumber}, {order.street}, {order.landmark}, {order.city}, {order.state}, {order.pincode}</p>
                    <p className="mb-2"><strong>Total Price:</strong> {order.totalPrice}</p>
                    <p className="mb-2"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p className="mb-2"><strong>Paid:</strong> {order.isPaid ? 'Yes' : 'No'}</p>
                    {razorpay !== null ? (
                        <p className="mb-2"><strong>Razorpay Payment id:</strong> {razorpay}</p>
                    ):(
                    <div></div>
                    )
                    }
                    <h2 className="text-xl font-semibold mt-6 mb-4">Products</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.products.map(product => (
                            <li key={product.productId.toString()} className="border p-4 rounded-lg relative">
                                <div className='absolute top-2 right-2'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className=' bg-white mt-2 rounded-full p-2'>
                                            <MoreHorizontal />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent >
                                            <DropdownMenuLabel>Change Status to</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleChangeStatus(order._id, String(product.productId), 'Order Confirmed')}>
                                                <button>
                                                    Order Confirmed
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleChangeStatus(order._id, product.productId.toString(), 'Shipped')}>
                                                <button>
                                                    Shipped
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleChangeStatus(order._id, product.productId.toString(), 'Out for delivery')}>
                                                <button>
                                                    Out for delivery
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleChangeStatus(order._id, product.productId.toString(), 'Delivered')}>
                                                <button>
                                                    Delivered
                                                </button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <a href={`/shop/product/${product.productId.toString()}`} className="mb-1"><strong>Product ID:</strong> {product.productId.toString()}</a>
                                <p className="mb-1"><strong>Color:</strong> {product.color}</p>
                                <p className="mb-1"><strong>Size:</strong> {product.size}</p>
                                <p className="mb-1"><strong>Quantity:</strong> {product.quantity}</p>
                                <p className="mb-1"><strong>Price:</strong> {product.price}</p>
                                <p className="mb-1"><strong>Delivery Status:</strong> {product.deliveryStatus}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center text-xl font-semibold text-red-500">Order does not exist</div>
            )}
        </div>
    );
}

export default Page;

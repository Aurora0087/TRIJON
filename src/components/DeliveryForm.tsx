"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'


import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { afterPaymentDone, makeOrder } from '@/database/action/order.action'
import { getSession } from 'next-auth/react'
import { User } from 'next-auth'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }).max(50, { message: "Full name must be less than 50 characters" }),
    mobileNumber: z.string().length(10, { message: "Mobile number must be exactly 10 digits" }),
    pincode: z.string().length(6, { message: "Pincode must be exactly 6 digits" }),
    houseNumber: z.string().min(1, { message: "House number is required" }),
    street: z.string().min(1, { message: "Street is required" }),
    landmark: z.string().min(1, { message: "Landmark is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    paymentMethod: z.string().min(1, { message: "Payment Method is required" }),
})



function DeliveryForm({ goodsCost, discont, deliveryCost, afterPayment }: { goodsCost: number, discont: number, deliveryCost: number, afterPayment: () => void }) {

    const [total, setTotal] = useState(0)

    const [user, setUser] = useState<User | null | undefined>(null)

    const router = useRouter()

    const { toast } = useToast()

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    useEffect(() => {
        fatchUser();
    }, []);

    useEffect(() => {
        setTotal((goodsCost + deliveryCost - discont) < 0 ? 0 : goodsCost + deliveryCost - discont)
    }, [goodsCost, discont, deliveryCost])

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    const handlePayment = async ({ razorpayOrderId, orderId, amount, mobileNumber }: { razorpayOrderId: string, orderId: string, amount: number, mobileNumber: number }) => {
        const res = await loadRazorpayScript();

        if (!res) {
            toast({
                variant: "destructive",
                description: "Failed to load Razorpay SDK",
            });
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amount,
            currency: 'INR',
            name: 'TRIJON',
            description: '',
            order_id: razorpayOrderId,
            handler: async function (response: any) {
                // Handle payment success

                await afterPaymentDone({ orderId, email: user?.email as string })
                    .then((res) => {
                        toast({
                            description: `${res.message}`,
                        });
                        afterPayment()
                    }).catch((e) => {
                        toast({
                            variant: "destructive",
                            title: "payment Failed",
                            description: `${String(e)}`,
                        });
                    })
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: mobileNumber,
            },
            theme: {
                color: "#F37254"
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            // Handle payment failure
            toast({
                variant: "destructive",
                description: "Payment failed",
            });
            console.log(response.error);
        });
        rzp.open();
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            mobileNumber: "",
            pincode: "",
            houseNumber: "",
            street: "",
            landmark: "",
            city: "",
            state: "",
            paymentMethod: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (user === null || user === undefined) {
            return
        }
        await makeOrder({
            email: user.email as string,
            fullName: values.fullName,
            mobileNumber: values.mobileNumber,
            pincode: values.pincode,
            houseNumber: values.houseNumber,
            street: values.street,
            landmark: values.landmark,
            city: values.city,
            state: values.state,
            paymentMethod: values.paymentMethod
        }).then(async (res) => {

            if (!res.success) {
                toast({
                    variant: "destructive",
                    description: "Fail to create Order",
                })
                return
            }

            if (values.paymentMethod === "RAZORPAY") {
                //open rezorpay and make payment
                await handlePayment({
                    razorpayOrderId: res.razorpayOrderId,
                    orderId: res.orderId,
                    amount: Number(res.amount),
                    mobileNumber: Number(values.mobileNumber)
                })
            }


            toast({
                description: "Order created.",
            })

            router.push("/orders")

        }).catch((e) => {
            toast({
                variant: "destructive",
                title: "error",
                description: `${String(e)}`,
            })
        })
    }

    return (
        <div className="min-w-md w-full p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Where should the order be delivered?</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name (First and Last name)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your mobile number..." type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your pincode..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="houseNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>House Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your house number..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your street..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Landmark</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nearby landmark..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your city..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a State" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                                        <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                                        <SelectItem value="Assam">Assam</SelectItem>
                                        <SelectItem value="Bihar">Bihar</SelectItem>
                                        <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                                        <SelectItem value="Goa">Goa</SelectItem>
                                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                                        <SelectItem value="Haryana">Haryana</SelectItem>
                                        <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                                        <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                                        <SelectItem value="Kerala">Kerala</SelectItem>
                                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                        <SelectItem value="Manipur">Manipur</SelectItem>
                                        <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                                        <SelectItem value="Mizoram">Mizoram</SelectItem>
                                        <SelectItem value="Nagaland">Nagaland</SelectItem>
                                        <SelectItem value="Odisha">Odisha</SelectItem>
                                        <SelectItem value="Punjab">Punjab</SelectItem>
                                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                                        <SelectItem value="Sikkim">Sikkim</SelectItem>
                                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                        <SelectItem value="Telangana">Telangana</SelectItem>
                                        <SelectItem value="Tripura">Tripura</SelectItem>
                                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                        <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={"COD"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="COD">Pay on Delivery</SelectItem>
                                        <SelectItem value="RAZORPAY">Pay online</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="border-t pt-4 mb-4">
                        <h3 className="font-semibold mb-2">TOTAL AMOUNT</h3>
                        <div className="flex justify-between">
                            <span>Cost of goods</span>
                            <span>{`₹ ${goodsCost}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{`₹ ${deliveryCost}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount amount</span>
                            <span>{`₹ ${discont}`}</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-2">
                            <span>Total</span>
                            <span>{`₹ ${total}`}</span>
                        </div>
                    </div>
                    <Button
                        disabled={form.getValues().city === "" || form.getValues().paymentMethod === "" || form.getValues().fullName === "" || form.getValues().houseNumber === "" || form.getValues().landmark === "" || form.getValues().mobileNumber === "" || form.getValues().pincode === "" || form.getValues().state === "" || form.getValues().street === "" || form.formState.isSubmitting}
                        type='submit'
                        className="w-full rounded-full">
                        Pay
                    </Button>
                </form>
            </Form>
        </div >
    )
}

export default DeliveryForm
"use client"

import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"


import { Textarea } from './ui/textarea'
import { getSession } from 'next-auth/react'
import { User } from 'next-auth'
import ReviewRating from './ReviewRating'
import { addReview } from '@/database/action/review.action'

const formSchema = z.object({
    text: z.string().min(2, "Review must be at least 2 characters").max(500, "Review must be at most 500 characters"),
    rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
})

function PostReview({ productId }: { productId: string }) {

    const { toast } = useToast()

    const [user, setUser] = useState<User | null | undefined>(null)

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    useEffect(() => {
        fatchUser()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            rating: 1,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (user === null || user === undefined) {
            toast({
                variant: "destructive",
                description: "Your are not login, please login.",
            })
            return
        }
        await addReview({ userEmail: user?.email as string, productId: productId, rating: values.rating, comment: values.text })
            .then((res) => {
                toast({
                    description: "Your Review is posted, thankes for Your feedback.",
                })
                form.reset()
            })
            .catch((e) => {
                toast({
                    variant: "destructive",
                    description: `${String(e)}`,
                })
            })
    }


    return (
        <div className='w-full py-4 px-2'>
            <Toaster />
            {user ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overall Rating</FormLabel>
                                    <FormControl>
                                        <>
                                            <ReviewRating totalStars={5} onRatingChange={field.onChange} />
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Written Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={form.formState.isSubmitting || form.getValues().text === ""}
                            type="submit"
                            className='rounded-full'
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            ) : (
                <a href="/">
                    <Button className=' rounded-full'>Login to Write Review</Button>
                </a>
            )}
        </div>
    )
}

export default PostReview
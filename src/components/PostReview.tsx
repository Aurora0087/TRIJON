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
import { Textarea } from './ui/textarea'
import { getSession } from 'next-auth/react'
import { User } from 'next-auth'

const formSchema = z.object({
    text: z.string().min(2).max(50),
})

function PostReview({ uId, productId }: { uId: string, productId: string }) {

    const [user, setUser] = useState<User | null | undefined>(null)

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
    }

    useEffect(() => {
        fatchUser()
    },[])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <div className=' w-full py-4 px-2'>
            {user !== null ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Write Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={form.getValues().text === ""}
                            type="submit"
                            className=' rounded-full'
                        >Submit</Button>
                    </form>
                </Form>
            ) : (
                    <Button>Login for Writing Review</Button>
            )}

        </div>
    )
}

export default PostReview
"use client"

import React from 'react'
import { useToast } from './use-toast'
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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { Textarea } from './textarea'
import ReviewRating from '../ReviewRating'
import { Toaster } from './toaster'
import { Edit } from 'lucide-react'

const formSchema = z.object({
    text: z.string().min(2, "Review must be at least 2 characters").max(500, "Review must be at most 500 characters"),
    rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
})

function EditReview({rating,comment,currentUserEmail,reviewId, afterEdit}: {rating:number,comment:string,currentUserEmail:string,reviewId:string, afterEdit: ()=>void}) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: comment,
            rating: rating,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

    }

    return (
        <div className='w-full py-4 px-2'>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Edit />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit Review</AlertDialogTitle>
                        <AlertDialogDescription>
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
                                    <AlertDialogAction>
                                        <Button
                                            disabled={form.formState.isSubmitting || form.getValues().text === ""}
                                            type="submit"
                                            className='rounded-full'
                                        >
                                            Submit
                                        </Button>
                                    </AlertDialogAction>
                                </form>
                            </Form>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Toaster />

        </div>
    )
}

export default EditReview
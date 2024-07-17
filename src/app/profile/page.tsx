"use client"

import IsLogined from '@/components/isLogined'
import WidthWrraper from '@/components/WidthWrraper'
import { User } from 'next-auth'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Edit, Pen, ShoppingCart, Truck } from 'lucide-react'
import { IUser } from '@/database/models/user.model'
import { getUserByEmail, updateUserDetails } from '@/database/action/user.action'
import { formatISODate } from '@/lib/utils'

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

import { useToast } from "@/components/ui/use-toast"
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton'
import BackButton from '@/components/BackButton'


function page() {
    const [user, setUser] = useState<User | null | undefined>(null);
    const [userDetails, setUserDetails] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        fetchUserAuth();
    }, []);

    useEffect(() => {
        if (user) {
            getUserDetails();
        }
    }, [user]);

    async function getUserDetails() {
        if (!user) {
            return;
        }
        setLoading(true);
        await getUserByEmail({ email: user.email as string }).then((res) => {
            setUserDetails(res);
            setLoading(false);
            console.log(res);
        });
    }

    async function fetchUserAuth() {
        const session = await getSession();
        if (session?.user) {
            setUser(session.user);
            console.log(session.user);
        }
    }

    async function handleGoogleSignIn() {
        await signIn('google').then(() => {
            router.push("/");
        });
    }

    return (
        <WidthWrraper className='bg-slate-100 min-h-screen'>
            {loading ? (
                <ProfilePageSkeleton />
            ) : userDetails && user ? (
                    <div className='py-8 flex flex-col gap-4 items-center'>
                        <div className=' w-full'>
                            <BackButton/>
                        </div>
                    <h3 className='text-3xl font-semibold'>{`Hello, ${user.name}`}</h3>
                    <div>
                        <Avatar className='w-20 h-20'>
                            <AvatarImage src={user.image!} />
                            <AvatarFallback>{user.name}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='rounded-lg bg-slate-50 p-4 w-full'>
                        <div className='flex flex-col md:flex-row justify-between gap-4 items-center'>
                            <div className='flex gap-2 items-center text-xs text-slate-500'>
                                <span>E-Mail:</span>
                                <span className='text-slate-900 font-semibold'>{userDetails.email}</span>
                            </div>
                            <div className='flex gap-2 items-center text-xs text-slate-500'>
                                <span>Joined:</span>
                                <span className='text-slate-900'>{formatISODate({ isoString: String(userDetails.joined) })}</span>
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 w-full my-4'>
                            <Button variant="link" onClick={() => router.push('/orders')} className='bg-slate-100 rounded-lg shadow-md flex gap-2 items-center border-b-2 md:border-b-0 md:border-r-2'>
                                <Truck />
                                Orders
                            </Button>
                            <Button variant="link" onClick={() => router.push('/cart')} className='bg-slate-100 rounded-lg shadow-md flex gap-2 items-center border-t-2 md:border-t-0 md:border-l-2'>
                                <ShoppingCart />
                                Cart
                            </Button>
                        </div>
                        <div className='flex flex-col gap-2 p-2 text-sm'>
                            <div className='flex gap-2 items-center'>
                                <span>Information:</span>
                                {/* EditProfile component here */}
                            </div>
                            <div className='flex flex-col md:flex-row gap-x-8 gap-y-2'>
                                <div className='flex gap-2 items-center text-slate-500'>
                                    <span>First Name:</span>
                                    <span className='text-slate-900'>{userDetails.firstName}</span>
                                </div>
                                <div className='flex gap-2 items-center text-slate-500'>
                                    <span>Last Name:</span>
                                    <span className='text-slate-900'>{userDetails.lastName}</span>
                                </div>
                            </div>
                            <div className='flex gap-2 items-center text-slate-500'>
                                <span>UserName:</span>
                                <span className='text-slate-900'>{userDetails.name}</span>
                            </div>
                            <div className='flex gap-2 items-center text-slate-500'>
                                <span>Mobile No.:</span>
                                <span className='text-slate-900'>{userDetails.mobile}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='py-8 grid place-content-center gap-4 min-h-screen'>
                    <h3 className='text-3xl text-red-400 font-semibold'>You need to login to see this Page.</h3>
                    <Button variant="link" onClick={handleGoogleSignIn} className='rounded-full'>
                        Login with Google
                    </Button>
                </div>
            )}
        </WidthWrraper>
    )
}

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    firstName: z.string().min(1, {
        message: "First name must be at least 1 character.",
    }).max(10, {
        message: "First name must be at most 10 characters.",
    }),
    lastName: z.string().min(1, {
        message: "Last name must be at least 1 character.",
    }).max(10, {
        message: "Last name must be at most 10 characters.",
    }),
    mobile: z.string().length(10, {
        message: "Mobile number must be exactly 10 digits.",
    })
})

function EditProfile({ uid, firstName, lastName, userName, mobile, getUser }: { uid: string, firstName: string, lastName: string, userName: string, mobile: string, getUser: () => void }) {


    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: userName,
            firstName: firstName,
            lastName: lastName,
            mobile: mobile,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        await updateUserDetails({ uid: uid, firstName: values.firstName, lastName: values.lastName, userName: values.username, mobile: values.mobile }).then((res => {
            getUser()

            toast({
                description: "Profile updated.",
            })
        }))
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className=' rounded-full hover:text-blue-500 aspect-square p-1 w-6 h-6 overflow-hidden'>
                    <Pen className='w-full h-full' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mobile" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose>
                                <Button type="submit"
                                    disabled={
                                        form.formState.isSubmitting
                                    }
                                >Save changes</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default page
"use client"

import BackButton from '@/components/BackButton'
import ProductCard from '@/components/card/ProductCard'
import { Button } from '@/components/ui/button'
import WidthWrraper from '@/components/WidthWrraper'
import { deleteFromWishList, getWishListByEmail } from '@/database/action/product.action'
import { MoreHorizontal, Trash } from 'lucide-react'
import { User } from 'next-auth'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function page() {

    const [user, setUser] = useState<User | null | undefined>(null);
    const [wishlistedProducts, setWishlistedProducts] = useState<any[]>([]); // Adjust type as per your IProduct interface

    async function fetchUser() {
        const session = await getSession();
        setUser(session?.user);
    }

    async function fetchWishList() {
        if (!user) return;
        try {
            const products = await getWishListByEmail({ email: user.email as string });
            setWishlistedProducts(products);
        } catch (error) {
            console.error('Error fetching wishlisted products:', error);
        }
    }

    async function removeFromWishlist(productId: string) {
        try {
            await deleteFromWishList({ email: user?.email as string, productId });
            fetchWishList(); // Fetch updated wishlist after deletion
        } catch (error) {
            console.error("Error deleting product from wishlist:", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchWishList();
        }
    }, [user]);

    return (
        <WidthWrraper className="min-h-screen w-full bg-slate-100 py-8">
            <div className=' my-4 grid gap-4'>
                <div><BackButton /></div>
                <h2 className="text-2xl font-extrabold">Your WishList</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {wishlistedProducts.map((product) => (
                    <div key={product._id} className=' relative'>
                        <div className=' absolute top-2 left-2 z-10'>
                            <Button
                                variant="destructive"
                                className=' rounded-full p-0 aspect-square'
                                onClick={() => removeFromWishlist(product._id)}>
                                <Trash />
                            </Button>
                        </div>
                        <ProductCard
                            id={product._id}
                            imageSrc={product.imageList[0]} // Assuming first image as main image
                            productName={product.title}
                            price={product.mainPrice}
                            sizes={product.varient.map((variant: { size: any }) => variant.size)}
                            colors={product.varient.reduce((totalColors: any, variant: { colors: string | any[] }) => totalColors + variant.colors.length, 0)}
                        />
                    </div>

                ))}
            </div>
        </WidthWrraper>
    );
}

export default page
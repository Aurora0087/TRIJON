"use client"

import AdminProductDetails from '@/components/AdminProductDetails';
import AdminProductEditDetails from '@/components/AdminProductEditDetails';
import AdminProductEditImages from '@/components/AdminProductEditImages';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { deleteProductDetails, getProductsById } from '@/database/action/product.action';
import { IProduct } from '@/database/models/product.model';
import { SearchParamProps } from '@/types'
import React, { useEffect, useState } from 'react'

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

import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

function page({ params: { id } }: SearchParamProps) {

    const { toast } = useToast()

    const router = useRouter()

    const [product, setProduct] = useState<IProduct | null>(null)

    async function getProduct() {
        try {
            const res = await getProductsById({ id });
            setProduct(res);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }


    useEffect(() => {
        getProduct()
    }, [id]);

    async function deleteProduct() {
        if (product === null) {
            toast({
                variant:'destructive',
                title: "Error",
                description: `Can't Find Product.`,
            });
            return
        }
        await deleteProductDetails({ productId: product._id }).then((res) => {
            toast({
                description: `Product deleted.`,
            });
            router.push("/dashbord/products")
        }).catch((e) => {
            toast({
                variant:'destructive',
                title: "Error",
                description: `${e as string}`,
            });
        })
    }

    return (
        <div className='py-8 px-3 w-full bg-slate-100'>
            <Toaster/>
            <div>
                <BackButton />
            </div>
            {product ? (
                <div className=' flex flex-col gap-8'>
                    <AdminProductDetails
                        id={product._id}
                        title={product.title}
                        description={product.description}
                        buyingPrice={product.buyingPrice}
                        mainPrice={product.mainPrice}
                        rating={product.rating}
                        images={product.imageList}
                        varient={product.varient} />
                    <div className=' py-4 border-t-2 border-blue-500'>
                        <h1 className=' text-4xl mb-4'>Edit Product:</h1>
                        <Tabs defaultValue="Details" className=" w-full">
                            <TabsList className=' w-full grid-cols-2'>
                                <TabsTrigger className=' w-full' value="Details">Details</TabsTrigger>
                                <TabsTrigger className=' w-full' value="Images">Images</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Details">
                                <AdminProductEditDetails productId={product._id} varient={product.varient} afterUpdate={getProduct} />
                            </TabsContent>
                            <TabsContent value="Images">
                                <AdminProductEditImages productId={product._id} afterUpdate={getProduct} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className=" flex flex-col gap-4 w-full py-4 border-t-2 border-blue-500">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Product</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete product and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteProduct} className=' bg-red-500'>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default page
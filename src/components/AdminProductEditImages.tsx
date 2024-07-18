"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { editProductImages } from '@/database/action/product.action';

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

interface AdminProductEditImagesProps {
    productId: string;
    afterUpdate: ()=>void
}

function AdminProductEditImages({ productId,afterUpdate }: AdminProductEditImagesProps) {
    const { toast } = useToast();

    const [images, setImages] = useState<File[]>([])
    const [imagesUrl, setImagesUrl] = useState<string[]>([])

    const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const files = event.target.files

        if (files) {
            const fileArray = Array.from(files)
            setImages(fileArray)
            const urls = fileArray.map((file) => URL.createObjectURL(file))
            setImagesUrl(urls)
        } else {
            setImages([])
            setImagesUrl([])
        }
    }

    const uploadImages = async () => {
        try {
            const imageBase64Promises = images.map(fileToBase64);
            const imageBase64List = await Promise.all(imageBase64Promises)

            await editProductImages({productId:productId,imageList:imageBase64List})
            toast({
                title: 'Images Uploaded',
                description: 'Images uploaded successfully!',
            });
            // Clear the state after successful upload
            setImages([])
            setImagesUrl([])
            afterUpdate()
        } catch (error) {
            toast({
                title: 'Error',
                description: `Error uploading images: ${error}`,
            });
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <div className=" grid gap-3">
                    <h1 className=" font-semibold text-sm">Product Images(Max size 5mb) </h1>
                    <Input
                        type="file"
                        id="images"
                        accept="image/*"
                        onChange={handleImagesChange}
                        multiple
                        required
                    />
                    {imagesUrl && (
                        <div className=" grid grid-cols-3 gap-2">
                            {imagesUrl.map((url, index) => (
                                <div key={index} className="w-full overflow-hidden rounded-xl border-2 border-blue-500">
                                    <img src={url} alt="Product Images Preview" className="w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            <Button
                onClick={uploadImages}
                disabled={images.length === 0}
            >
                Upload Images
            </Button>
        </div>
    );
}

export default AdminProductEditImages;

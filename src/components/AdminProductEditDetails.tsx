"use client"

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
import { Input } from "./ui/input"
import { editProductDetails, getProductsById } from "@/database/action/product.action"
import { Textarea } from "./ui/textarea"
import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "./ui/use-toast"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    categorys: z.string().min(2, {
        message: "Category must be at least 2 characters.",
    }),
    buyingPrice: z.string().min(1, {
        message: "Buying Price must be at least 1 character.",
    }),
    mainPrice: z.string().min(1, {
        message: "Main Price must be at least 1 character.",
    }),
    varient: z.array(
        z.object({
            size: z.string(),
            colors: z.array(
                z.object({
                    name: z.string(),
                    value: z.string(),
                    stockes: z.string().refine(val => !isNaN(Number(val)), {
                        message: "Stocks must be a number.",
                    }),
                })
            ),
        })
    ),
}).refine(data => parseFloat(data.mainPrice) >= parseFloat(data.buyingPrice), {
    message: "Main Price must be greater than or equal to Buying Price.",
    path: ["mainPrice"],
});

interface UpdateProductProps {
    productId: string;
    varient: any[];
    afterUpdate:()=>void
}

function AdminProductEditDetails({ productId, varient, afterUpdate }: UpdateProductProps) {

    const { toast } = useToast()

    const initialVarient = varient.map(v => ({
        ...v,
        colors: v.colors.map((c: { stockes: any }) => ({
            ...c,
            stockes: String(c.stockes),
        })),
    }));

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            categorys: "",
            buyingPrice: "",
            mainPrice: "",
            varient: initialVarient,
        },
    })

    useEffect(() => {
        async function fetchProductDetails() {
            const product = await getProductsById({ id: productId });

            form.setValue("title", product.title);
            form.setValue("description", product.description);
            form.setValue("categorys", product.category.join(","));
            form.setValue("buyingPrice", product.buyingPrice.toString());
            form.setValue("mainPrice", product.mainPrice.toString());
        }

        fetchProductDetails();
    }, [productId, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            const result = await editProductDetails({
                title: values.title,
                description: values.description,
                categorys: values.categorys,
                buyingPrice: values.buyingPrice,
                mainPrice: values.mainPrice,
                productId,
                varient: values.varient,
            });

            toast({
                title: "Product Updated",
                description: `Product ID: ${result._id}`,
            });

            form.reset()
            setSizeVarients(form.getValues().varient)
            afterUpdate()
        } catch (error) {
            toast({
                title: "Error",
                description: `${String(error)}`,
            });
        }
    }

    const [sizeVarients, setSizeVarients] = useState(form.getValues().varient);

    const addColor = (index: number) => {
        const currentVariants = [...form.getValues().varient];
        currentVariants[index].colors.push({ name: "", value: "", stockes: "" });
        form.setValue("varient", currentVariants);
        setSizeVarients(form.getValues().varient);
    };

    const removeColor = (variantIndex: number, colorIndex: number) => {
        const currentVariants = [...form.getValues().varient];
        currentVariants[variantIndex].colors.splice(colorIndex, 1);
        form.setValue("varient", currentVariants);
        setSizeVarients(form.getValues().varient);
    };

    const addVariant = () => {
        form.setValue("varient", [...form.getValues().varient, { size: "", colors: [] }]);
        setSizeVarients(form.getValues().varient);
    };

    const removeVariant = (index: number) => {
        const currentVariants = [...form.getValues().varient];
        currentVariants.splice(index, 1);
        form.setValue("varient", currentVariants);
        setSizeVarients(form.getValues().varient);
    };

    return (
        <Form {...form}>
            <Toaster />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categorys"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categorys</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter categorys (comma separated)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="buyingPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Buying Price</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter buying price" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Main Price</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter main price" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {sizeVarients.map((variant, variantIndex) => (
                    <div key={variantIndex} className="px-2">
                        <FormField
                            control={form.control}
                            name={`varient[${variantIndex}].size` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Size" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {variant.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="px-2">
                                <FormField
                                    control={form.control}
                                    name={`varient[${variantIndex}].colors[${colorIndex}].name` as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Color Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Color Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`varient[${variantIndex}].colors[${colorIndex}].value` as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Color Value</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Color Value" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`varient[${variantIndex}].colors[${colorIndex}].stockes` as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stocks</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Stocks" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="p-4">
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={() => removeColor(variantIndex, colorIndex)}
                                    >
                                        Remove Color
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 w-full p-4">
                            <Button type="button" className=" rounded-full" onClick={() => addColor(variantIndex)}>
                                Add Color
                            </Button>
                            <Button variant="destructive" className=" rounded-full" type="button" onClick={() => removeVariant(variantIndex)}>
                                Remove Size
                            </Button>
                        </div>
                    </div>
                ))}
                <div className="flex flex-col gap-4 w-full">
                    <Button variant='outline' type="button" onClick={addVariant} className="w-full rounded-full">
                        Add Size
                    </Button>
                    <Button type="submit"
                        disabled={
                            form.getValues().title === "" ||
                            form.getValues().description === "" ||
                            form.getValues().categorys === "" ||
                            form.getValues().mainPrice === "" ||
                            form.getValues().buyingPrice === "" ||
                            form.getValues().varient.length === 0 ||
                            form.formState.isSubmitting}
                        className="w-full rounded-full">
                        {
                            form.formState.isSubmitting ? (
                                "Updating..."
                            ) : (
                                "Update"
                            )
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default AdminProductEditDetails

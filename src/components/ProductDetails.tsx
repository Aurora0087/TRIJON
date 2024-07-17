"use client"

import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import { Button } from './ui/button';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { User } from 'next-auth';
import { addToCart } from '@/database/action/cart.action';
import { Toaster } from './ui/toaster';
import { useToast } from './ui/use-toast';
import { addToWishList } from '@/database/action/product.action';

function ProductDetails({ id, title, description, buyingPrice, mainPrice, rating, images, varient ,totalReviews }: { id: string, title: string, description: string,totalReviews:number, buyingPrice: number, mainPrice: number, rating: number, images: string[], varient: { size: string, colors: { name: string, value: string, stockes: number }[] }[] }) {

  const [variantIndex, setVarientIndex] = useState(0)
  const [sizeTYpe, setSizeType] = useState(varient[0].size)
  const [colorIndex, setColorIndex] = useState(0)
  const [colorType, setColorType] = useState(varient[0].colors[0].name)
  const [avalableStock, setAvalableStock] = useState(varient[0].colors[0].stockes)

  const [quantity, setQuantity] = useState(0);
  const [user, setUser] = useState<User | null | undefined>(null)

  const { toast } = useToast()

  useEffect(() => {
    setColorIndex(0)
    setSizeType(varient[variantIndex].size)
    setAvalableStock(varient[variantIndex].colors[0].stockes)
    setQuantity(0)
  }, [variantIndex])

  useEffect(() => {
    setColorType(varient[variantIndex].colors[colorIndex].name)
    setAvalableStock(varient[variantIndex].colors[colorIndex].stockes)
    setQuantity(0)
  }, [colorIndex])

  useEffect(() => {
    fatchUser()
  }, [])

  async function fatchUser() {
    await getSession().then((res) => {
      setUser(res?.user)
    })
  }

  async function handleAddToWishList() {
    if (user === null || user === undefined) {
      toast({
        description: "Login first to add this item to your wishlist.",
      })
      return
    }
    try {
      
      await addToWishList({ email: String(user.email), productId: id })
      toast({
        description: "Added to wishlist.",
      })
    } catch (error) {
      toast({
        description: String(error),
      })
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className=" grid place-content-center">
          <ImageShower images={images} />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            {title}
          </h1>
          <div className="flex items-center mb-2">
            <StarRating rating={rating} />
            <span className="ml-2 text-sm">{totalReviews}</span>
          </div>
          <div className=' flex gap-4'>
            <p className="text-xl font-semibold mb-4 py-2">{`₹ ${buyingPrice}`}</p>
            {buyingPrice !== mainPrice && (
              <>
                <del className=" text-red-500 mb-4 text-center py-2">{`₹ ${mainPrice}`}</del>
                <span className=' bg-red-400 rounded-full px-4 py-2 h-fit font-semibold text-white'>{`${(((mainPrice-buyingPrice)/mainPrice)*100).toFixed(2)}% OFF`}</span>
              </>
              
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Color:</label>
            <div className="flex gap-2">
              {
                varient[variantIndex].colors.map((v, i) => {
                  return (
                    <div key={i} className=' flex flex-col gap-2 capitalize'>
                      <span className={`${colorIndex === i && "text-blue-500 font-semibold"} text-sm`}>{v.name}</span>
                      <Button
                        onClick={() => setColorIndex(i)}
                        style={{ backgroundColor: `${v.value}` }}
                        className={`w-8 h-8 p-1 border-2 rounded-full ${colorIndex === i && "border-[#519fff]"} shadow`}></Button>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Size:</label>
            <div className="flex gap-2 capitalize">
              {
                varient.map((v, i) => {
                  return (
                    <Button key={i}
                      variant="outline"
                      onClick={() => setVarientIndex(i)}
                      className={`px-4 py-2 rounded-full border-2 ${variantIndex === i && " border-blue-400"} uppercase`}>{v.size}</Button>
                  )
                })
              }
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Available Stock:</label>
            <span className="text-xl font-semibold mb-4 py-2">{avalableStock}</span>
          </div>
          <div className="flex items-center mb-4">
            <label className="block mb-1">Quantity:</label>
            <div className="flex items-center ml-2">
              <Button
                variant='outline'
                className="px-2 py-1 border rounded-full"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </Button>
              <span className="px-4 py-2 border-t border-b">{quantity}</span>
              <Button
                variant='outline'
                className="px-2 py-1 border rounded-full"
                onClick={() => setQuantity(Number(varient[variantIndex].colors[colorIndex].stockes) <= quantity + 1 ? Number(varient[variantIndex].colors[colorIndex].stockes) : quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <div className=''>
            <Button className=' w-full mb-4 rounded-full' onClick={handleAddToWishList}>
              <Heart className=' mr-2'/>
              Add to WishList
            </Button>
          </div>
          <AddtoCart productId={id} size={sizeTYpe} color={colorType} quantity={String(quantity)} />
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="mb-4">
          {description}
        </p>
      </div>
    </div>
  )
}

export function StarRating({ rating }: { rating: number }) {
  const percentage = (rating / 5) * 100;

  return (
    <div className="relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 24"
        className="w-32 h-6"
        fill="none"
        stroke="currentColor"
      >
        <defs>
          <linearGradient id="grad1">
            <stop offset={`${percentage}%`} stopColor="gold" />
            <stop offset={`${percentage}%`} stopColor="gray" />
          </linearGradient>
        </defs>
        <g stroke="none" strokeWidth="1" fill="url(#grad1)" fillRule="evenodd">
          <path
            d="M12 .587l3.668 7.571L24 9.748l-6 5.844 1.418 8.261L12 18.896l-7.418 4.957L6 15.592 0 9.748l8.332-1.59z M36 .587l3.668 7.571L48 9.748l-6 5.844 1.418 8.261L36 18.896l-7.418 4.957L30 15.592 24 9.748l8.332-1.59z M60 .587l3.668 7.571L72 9.748l-6 5.844 1.418 8.261L60 18.896l-7.418 4.957L54 15.592 48 9.748l8.332-1.59z M84 .587l3.668 7.571L96 9.748l-6 5.844 1.418 8.261L84 18.896l-7.418 4.957L78 15.592 72 9.748l8.332-1.59z M108 .587l3.668 7.571L120 9.748l-6 5.844 1.418 8.261L108 18.896l-7.418 4.957L102 15.592 96 9.748l8.332-1.59z"
          />
        </g>
      </svg>
    </div>
  );
}


function ImageShower({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])



  return (
    <div>
      <Carousel
        setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {images.map((imageurl, i) => (
            <CarouselItem key={i}>
              <div className=' w-full h-full overflow-hidden rounded-xl'>
                <img className=' w-full h-full object-cover' src={imageurl} alt='' width={5000} height={5000} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className=' left-0' />
        <CarouselNext className=' right-0' />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground flex gap-2 w-full px-2 justify-center">
        {
          images.map((imagUrl, i) => {
            return (
              <Button key={i}
                variant='outline'
                className={`h-11 w-11 border-2 overflow-hidden ${i === (current - 1) && " border-blue-500"}`}
                onClick={() => api?.scrollTo(i)}>
                <img className=' w-full h-full object-cover' src={imagUrl} alt={`${i}`} width={100} height={100} />
              </Button>
            )
          })
        }
      </div>
    </div>
  )
}

function AddtoCart({
  productId, quantity, size, color
}: {
  productId: string, quantity: string, size: string, color: string
  }) {
  
    const [user, setUser] = useState<User | null | undefined>(null)

  const { toast } = useToast()

    useEffect(() => {
        fatchUser()
    }, [])

    async function fatchUser() {
        await getSession().then((res) => {
            setUser(res?.user)
        })
  }

  async function addIntoCart() {
    if (user === null || user === undefined) {
      toast({
        description: "Login first for Adding this to cart.",
      })
      return
    }
    await addToCart({ email: user?.email as string, productId, quantity, size, color }).then((res) => {
      
      toast({
        description: "Added to cart.",
      })
    }).catch((e) => {
      toast({
        title: "Error",
        description: String(e),
      })
    })
  }
  
  return (
    <Button disabled={user === null || user === undefined || quantity === "0"} className="w-full px-4 py-2 rounded-full flex items-center justify-center gap-2" onClick={addIntoCart}>
      <Toaster />
      <ShoppingCart />
      {user === null || user === undefined ? "Login to Add to Cart":" Add to cart"}
    </Button>
  )
}

export default ProductDetails
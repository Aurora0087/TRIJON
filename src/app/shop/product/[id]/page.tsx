"use client"

import BackButton from '@/components/BackButton'
import ReviewCard from '@/components/card/ReviewCard'
import PostReview from '@/components/PostReview'
import ProductDetails from '@/components/ProductDetails'
import SemilarProduct from '@/components/SemilarProduct'
import { getProductsById } from '@/database/action/product.action'
import { getReviews, IReviewWithUsername } from '@/database/action/review.action'
import { IProduct } from '@/database/models/product.model'
import { SearchParamProps } from '@/types'
import { User } from 'next-auth'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function ProductDetailspage({ params: { id } }: SearchParamProps) {

    const [product, setProduct] = useState<IProduct>();
    const [reviews, setReviews] = useState<IReviewWithUsername[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [ratingPercentages, setRatingPercentages] = useState<{ [key: number]: number }>({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    });

    const [currentUserID,setCurrentUserID] = useState<null| undefined | string>("")

    async function getProduct() {
        try {
            const res = await getProductsById({ id });
            setProduct(res);
            fetchReviews()
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    async function fetchReviews() {
        try {
            const { reviews, ratingPercentages, totalReviews } = await getReviews({ productId:id });
            setReviews(reviews);
            setTotalReviews(totalReviews)
            setRatingPercentages(ratingPercentages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    async function fatchUser() {
        await getSession().then((res) => {
            setCurrentUserID(res?.user.id)
        })
    }

    useEffect(() => {
        getProduct()
        fatchUser()
    }, [id, currentPage]);

    return (
        <div className='py-8 px-3 w-full bg-slate-50'>
            <div>
                <BackButton />
            </div>
            {product ? (
                <>
                    <ProductDetails
                        id={product._id}
                        title={product.title}
                        description={product.description}
                        totalReviews={totalReviews}
                        buyingPrice={product.buyingPrice}
                        mainPrice={product.mainPrice}
                        rating={product.rating}
                        images={product.imageList}
                        varient={product.varient} />
                    <div>
                        <SemilarProduct category={product.category[0]} productId={product._id} />
                    </div>
                    <div className='py-8'>
                        <div className='w-full'>
                            <PostReview productId={id} />
                        </div>
                        <div className='flex flex-col gap-4'>
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review._id}
                                    reviewId={review._id}
                                    name={review.username}
                                    date={new Date(review.createdAt)}
                                    rating={review.rating}
                                    comment={review.comment}
                                    currentUserName={String(currentUserID)}
                                    afterEdit={fetchReviews}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default ProductDetailspage
"use client"

import BackButton from '@/components/BackButton'
import ReviewCard from '@/components/card/ReviewCard'
import PostReview from '@/components/PostReview'
import ProductDetails from '@/components/ProductDetails'
import SemilarProduct from '@/components/SemilarProduct'
import { getProductsById } from '@/database/action/product.action'
import { getReviews, IReviewWithUsername } from '@/database/action/review.action'
import { IProduct } from '@/database/models/product.model'
import { IReview } from '@/database/models/review.model'
import { SearchParamProps } from '@/types'
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

    async function getProduct() {
        try {
            const res = await getProductsById({ id });
            setProduct(res);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    async function fetchReviews(productId: string, page: number) {
        try {
            const { reviews, totalPages, totalReviews, ratingPercentages } = await getReviews({ productId, page });
            setReviews(reviews);
            setTotalPages(totalPages);
            setTotalReviews(totalReviews);
            setRatingPercentages(ratingPercentages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    useEffect(() => {
        getProduct();
        fetchReviews(id, currentPage);
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
                        <SemilarProduct category={product.category[0]} />
                    </div>
                    <div className='py-8'>
                        <div className='w-full'>
                            <PostReview productId={id} />
                        </div>
                        <div className='flex flex-col gap-4'>
                            {reviews.map((review, index) => (
                                <ReviewCard
                                    key={index}
                                    name={review.username}
                                    date={new Date(review.createdAt)}
                                    rating={review.rating}
                                    comment={review.comment}
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
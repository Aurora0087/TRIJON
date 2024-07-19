"use client"

import React, { useEffect, useState } from 'react'
import EditReview from './EditReview'
import { isAuthor } from '@/database/action/review.action'

function IsReviewAuther({ reviewId,rating,comment,afterEdit,currentUserId }: { reviewId: string,rating:number,comment:string,currentUserId:string, afterEdit: ()=>void }) {


    const [isAuther,setIsAuther] = useState(false)
    async function autherV() {
        await isAuthor({ reviewId, userId: String(currentUserId) }).then((res) => {
            setIsAuther(res.isAuthor)
        })
    }

    useEffect(() => {
        autherV()
    },[reviewId])

    return (
        <div className=' absolute top-4 right-4'>
            {
                isAuther &&  <EditReview reviewId={reviewId} rating={rating} comment={comment} currentUserEmail={String(currentUserId)} afterEdit={afterEdit} />
            }
        </div>
    )
}

export default IsReviewAuther
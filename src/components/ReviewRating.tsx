"use client"

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import React, { useState } from 'react'

function ReviewRating({ totalStars, onRatingChange,defaultRating=1 }: { totalStars: number,defaultRating?:number, onRatingChange: (index:number) => void }) {
    const [rating, setRating] = useState<number>(defaultRating);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const handleClick = (index: number) => {
        setRating(index);
        if (onRatingChange) {
            onRatingChange(index);
        }
    }

    const handleMouseEnter = (index: number) => {
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    return (
        <div className="flex items-center">
            {Array.from({ length: totalStars }, (_, index) => index + 1).map((index) => (
                <Star
                    key={index}
                    className={cn("cursor-pointer", {
                        "text-yellow-500": index <= (hoverRating || rating),
                        "text-gray-300": index > (hoverRating || rating),
                    })}
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                />
            ))}
        </div>
    )
}

export default ReviewRating
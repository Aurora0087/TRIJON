"use client"

import { Star } from 'lucide-react';
import React from 'react'

interface ReviewProps {
    name: string;
    date: Date;
    rating: number;
    comment: string;
    imageUrl?: string;
}

function ReviewCard({ name, date, rating, comment, imageUrl }: ReviewProps) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return (
        <div className="p-4 border border-gray-200 rounded-md mb-4">
            <div className="flex items-center mb-2">
                <div className="mr-4">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`} />
                    ))}
                    {rating % 1 !== 0 && <Star className="w-4 h-4 text-yellow-500 fill-current" style={{ width: `${(rating % 1) * 100}%` }} />}
                </div>
            </div>
            <p className="mb-4">{comment}</p>
            {imageUrl && (
                <img src={imageUrl} alt="Review Image" className="w-32 h-32 object-cover rounded-md" />
            )}
        </div>
    );
}

export default ReviewCard
"use server"

import mongoose, { Schema } from "mongoose";

export interface IReview extends Document{
    _id: string;
    productId: string;
    user: string;
    comment: string;
    image?: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: String,
        required: [true, 'User is required'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
    },
    image: {
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

ReviewSchema.pre('save', function (next) {
    this.updatedAt = new Date;
    next();
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
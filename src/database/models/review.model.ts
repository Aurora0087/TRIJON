"use server"

import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document{
    _id: string;
    productId: string;
    userId: string;
    comment: string;
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
    userId: {
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

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)

export default Review;
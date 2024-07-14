"use server"

import mongoose from "mongoose";
import Product from "../models/product.model";
import Review, { IReview } from "../models/review.model";
import { getUserByEmail } from "./user.action";
import UserModel, { IUser } from "../models/user.model";

export async function addReview({userEmail,productId,rating,comment}:{userEmail:string,productId:string,rating:number,comment:string}) {
    
    try {
        // Fetch the user by email
        const user = await getUserByEmail({ email: userEmail });
        if (!user) {
            throw new Error("User not found");
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Create a new review document
        const newReview = new Review({
            productId,
            userId: user._id,
            rating,
            comment,
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        // Update the product's rating

        // Calculate the new average rating
        const reviews = await Review.find({ productId });
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRatings / reviews.length;

        // Save the updated product
        await product.save();

        return JSON.parse(JSON.stringify(savedReview));
    } catch (error) {
        console.error('Error adding review:', error);
        throw new Error('Error adding review. Please try again later.');
    }
}

export interface IReviewWithUsername extends Omit<IReview, 'userId'> {
    username: string;
}

export async function getReviews({productId,page}: { productId: string,page:number }) {
    const pageSize = 10; // Number of reviews per page
    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    try {
        // Fetch reviews from the database based on productId with pagination
        const reviews: IReview[] = await Review.find({ productId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(pageSize)
            .exec();

        // Get the total number of reviews for the product
        const totalReviews = await Review.countDocuments({ productId });

        // Calculate total pages
        const totalPages = Math.ceil(totalReviews / pageSize);

        // Aggregate the number of reviews for each rating
        const ratingCounts: { _id: number; count: number }[] = await Review.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: "$rating", count: { $sum: 1 } } }
        ]);

        // Calculate the percentage of each rating
        const ratingPercentages: { [key: number]: number } = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        ratingCounts.forEach((rating) => {
            ratingPercentages[rating._id as 1 | 2 | 3 | 4 | 5] = (rating.count / totalReviews) * 100;
        });

        // Fetch usernames for each review
        const reviewsWithUsernames: Promise<IReviewWithUsername>[] = reviews.map(async (review) => {
            const user: IUser | null = await UserModel.findById(review.userId);
            return {
                ...(review.toObject()),
                username: user ? user.name : 'Unknown User' // Provide a default if user not found
            };
        });

        // Wait for all promises to resolve
        const resolvedReviews: IReviewWithUsername[] = await Promise.all(reviewsWithUsernames);

        // Return the reviews and additional info
        return JSON.parse(JSON.stringify({
            reviews: resolvedReviews,
            totalPages,
            currentPage: page,
            totalReviews,
            ratingPercentages,
        }));
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        throw new Error('Error retrieving reviews. Please try again later.');
    }
}
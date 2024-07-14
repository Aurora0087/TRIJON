"use server"

import mongoose from "mongoose";
import UserModel, { IUser } from "../models/user.model";


export async function getUserByEmail({ email }: { email: string }): Promise<IUser | null> {
    try {
        const user = await UserModel.findOne({ email }).exec();
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error retrieving user by email: ", error);
        throw new Error("Error retrieving user by email");
    }
}

type UpdateUserResponse = IUser | null;

export async function updateUserDetails({
    uid,
    firstName,
    lastName,
    userName,
    mobile,
}: {
    uid: string;
    firstName: string;
    lastName: string;
    userName: string;
    mobile: string;
}): Promise<UpdateUserResponse> {
    try {
        // Validate the uid
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            throw new Error("Invalid user ID.");
        }

        // Find the user by uid and update their details
        const updatedUser = await UserModel.findByIdAndUpdate(
            uid,
            {
                firstName,
                lastName,
                name: userName,
                mobile,
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            throw new Error("User not found.");
        }

        return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
        console.error("Error updating user details:", error);
        throw new Error("Error updating user details. Please try again later.");
    }
}
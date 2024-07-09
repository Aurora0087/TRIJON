"use server"

import UserModel, { IUser } from "../models/user.model";


export async function getUserByEmail({ email }: { email: string }): Promise<IUser | null> {
    try {
        const user = await UserModel.findOne({ email }).exec();
        return user;
    } catch (error) {
        console.error("Error retrieving user by email: ", error);
        throw new Error("Error retrieving user by email");
    }
}
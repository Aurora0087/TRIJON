"use server"

import { Document, Model, Schema, model, models } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    mobile: string;
    password?: string;
    joined: Date;
    wishList: [];
    image: string;
    address: {
        houseNo: string,
        street: string,
        landMark: string,
        city: string,
        state: string,
        pinCode: string
    },
    isVerifyed: boolean;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    signUpMethod: 'GOOGLE' | 'CREDENTIALS';
    role: 'ADMIN' | 'USER'
}

const UserSchema: Schema<IUser> = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    wishList: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    image: {
        type: String,
        default: ""
    },
    joined: {
        type: Date,
        default: new Date()
    },
    address: {
        houseNo: {
            type:String,
            default:""
        },
        street: {
            type:String,
            default:""
        },
        landMark: {
            type:String,
            default:""
        },
        city: {
            type:String,
            default:""
        },
        state: {
            type:String,
            default:""
        },
        pinCode: {
            type:String,
            default:""
        },
    },
    isVerifyed: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    signUpMethod: {
        type: String,
    },
    role: {
        type: String,
        default: "USER"
    },
})

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
"use server"

import mongoose, { Document, Schema } from "mongoose";

export interface IColor {
    name: string;
    value: string;
    stockes: number;
}

const ColorSchema = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    stockes: { type: Number, required: true }
})

export interface IVarient {
    size: string;
    colors: IColor[];
}

const VarientSchema = new Schema({
    size: { type: String, required: true },
    colors: [ColorSchema]
})

export interface IProduct extends Document {
    _id: string;
    title: string;
    description: string;
    category: string[];
    buyingPrice: number;
    mainPrice: number;
    rating: number;
    imageList: string[];
    varient: IVarient[];
    createdAt: Date;
    updatedAt: Date;
    tax: number;
    packaging: number;
    deliveryCharges: number;
}

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: [{ type: String }],
    buyingPrice: { type: Number, required: true },
    mainPrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    imageList: { type: [String], required: true },
    varient: [VarientSchema],
    tax: { type: Number, default: 0 },
    packaging: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ProductSchema.pre('save', function (next) {
    this.updatedAt = new Date;
    next();
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
export default Product
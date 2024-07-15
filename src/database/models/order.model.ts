import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Order schema
export interface IOrder extends Document {
    _id: string;
    userId: mongoose.Schema.Types.ObjectId;
    fullName: string;
    mobileNumber: string;
    pincode: string;
    houseNumber: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    isPaid: boolean;
    paymentMethod: string;
    products: {
        productId: mongoose.Schema.Types.ObjectId;
        color: string;
        size: string;
        quantity: number;
        price: number; // price at the time of order
        deliveryStatus: string;
    }[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the Order model
const OrderSchema: Schema<IOrder> = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        fullName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        pincode: { type: String, required: true },
        houseNumber: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        paymentMethod:{type:String,required:true},
        isPaid: { type: Boolean, default: false },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                color: { type: String, required: true },
                size: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                deliveryStatus: { type: String, default: 'Pending' },
            }
        ],
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

// Create and export the Order model
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

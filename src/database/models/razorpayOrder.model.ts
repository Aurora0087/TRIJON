import mongoose, { Schema, Document } from 'mongoose';

interface IRazorpayOrder extends Document {
    orderId: string; // Razorpay order ID
    userId: mongoose.Schema.Types.ObjectId;
    amount: number;
    currency: string;
    receipt: string; // Receipt ID generated by you
    status: string; // Order status
    createdAt: Date;
    updatedAt: Date;
}

const RazorpayOrderSchema: Schema<IRazorpayOrder> = new Schema(
    {
        orderId: { type: String, required: true, unique: true }, // Razorpay order ID
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'INR' },
        receipt: { type: String, required: true },
        status: { type: String, required: true, default: 'created' },
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const RazorpayOrder = mongoose.models.RazorpayOrder || mongoose.model<IRazorpayOrder>('RazorpayOrder', RazorpayOrderSchema);

export default RazorpayOrder;

import mongoose, { Schema, Document } from 'mongoose';

interface ICartProduct {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number; // Optional: price at the time of adding to cart
    size: string; // Optional: size of the product
    color: string; // Optional: color of the product
}

export interface ICart extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    products: ICartProduct[];
    createdAt: Date;
    updatedAt: Date;
}

const CartProductSchema: Schema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number },
    size: { type: String },
    color: { type: String },
});

const CartSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        products: [CartProductSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;

"use server"

import Razorpay from 'razorpay';
import dbConnect from '../connect';
import UserModel from '../models/user.model';
import Cart from '../models/cart.model';
import Order, { IOrder } from '../models/order.model';
import RazorpayOrder from '../models/razorpayOrder.model';
import Product from '../models/product.model';
import { getImageUrl } from '../aws/s3/Utils';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_key_secret || "",
});

export async function makeOrder({
    email,
    fullName,
    mobileNumber,
    pincode,
    houseNumber,
    state,
    landmark,
    city,
    street,
}: {
    email: string;
    fullName: string;
    mobileNumber: string;
    pincode: string;
    houseNumber: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
}) {
    try {
        await dbConnect();

        // Find the user by email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            throw new Error('User not found');
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ userId: user._id }).exec();
        if (!cart || cart.products.length === 0) {
            throw new Error('Cart is empty');
        }

        // Calculate total price
        const totalPrice = cart.products.reduce((acc: number, product: { price: number; quantity: number; }) => acc + product.price, 0);

        // Create the order in your database
        const order = new Order({
            userId: user._id,
            fullName,
            mobileNumber,
            pincode,
            houseNumber,
            street,
            landmark,
            city,
            state,
            totalPrice,
            products: cart.products.map((product: { productId: any; color: any; size: any; quantity: any; price: any; }) => ({
                productId: product.productId,
                color: product.color,
                size: product.size,
                quantity: product.quantity,
                price: product.price,
                deliveryStatus: 'Pending',
            })),
            isPaid: false,
        })

        const savedOrder = await order.save();

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: totalPrice * 100, // amount in paise
            currency: 'INR',
            receipt: savedOrder._id.toString(),
        });

        // Save Razorpay order details in your database
        const razorpayOrderDetails = new RazorpayOrder({
            orderId: razorpayOrder.id,
            userId: user._id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            status: razorpayOrder.status,
        });

        await razorpayOrderDetails.save();

        return {
            success: true,
            orderId: savedOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        };
    } catch (error) {
        console.error('Error making order: ', error);
        throw new Error('Error making order');
    }
}

export async function afterPaymentDone({ orderId, email }: { orderId: string, email: string }) {
    try {
        await dbConnect();

        // Find the user by email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            throw new Error("User not found");
        }

        // Update the order to mark it as paid
        const order = await Order.findById(orderId).exec();
        if (!order) {
            throw new Error("Order not found");
        }
        order.isPaid = true;
        await order.save();

        // Decrease stock amount for each product in the order
        for (const item of order.products) {
            const product = await Product.findById(item.productId).exec();
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            // Find the variant and color
            const variant = product.varient.find((v: { size: any; }) => v.size === item.size);
            if (!variant) {
                throw new Error(`Variant with size ${item.size} not found in product ${item.productId}`);
            }

            const color = variant.colors.find((c: { name: any; }) => c.name === item.color);
            if (!color) {
                throw new Error(`Color ${item.color} not found in variant ${item.size} of product ${item.productId}`);
            }

            // Decrease stock
            color.stockes -= item.quantity;

            await product.save();
        }

        // Empty the user's cart
        await Cart.findOneAndUpdate(
            { userId: user._id },
            { products: [] }
        ).exec();

        return { success: true, message: 'Payment processed and cart emptied' };
    } catch (error) {
        console.error("Error processing payment: ", error);
        return { success: false, message: 'Error processing payment' };
    }
}

export async function getOrdersPayedByUser({ email }: { email: string }) {
    try {
        await dbConnect();

        // Find the user by email
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            throw new Error("User not found");
        }

        // Find all paid orders for the user and populate product details
        const orders = await Order.find({ userId: user._id, isPaid: true })
            .populate({
                path: 'products.productId',
                select: 'title imageList',
            })
            .exec();

        // Generate image URLs for each product
        const formattedOrders = await Promise.all(
            orders.map(async order => ({
                ...order.toObject(),
                products: await Promise.all(
                    order.products.map(async (product: { productId: { _id: any; title: any; imageList: string[]; }; color: any; size: any; quantity: any; price: any; deliveryStatus: any; }) => ({
                        _id: product.productId._id,
                        title: product.productId.title,
                        imageUrl: await getImageUrl(product.productId.imageList[0]),
                        color: product.color,
                        size: product.size,
                        quantity: product.quantity,
                        price: product.price,
                        deliveryStatus: product.deliveryStatus,
                    }))
                )
            }))
        );

        return JSON.parse(JSON.stringify({ success: true, orders: formattedOrders }));
    } catch (error) {
        console.error("Error retrieving paid orders: ", error);
        return { success: false, message: 'Error retrieving paid orders' };
    }
}

export interface OrderDetailsResponse {
    orders: IOrder[];
    totalOrders: number;
}

export async function getOrdersDetails(): Promise<OrderDetailsResponse> {
    await dbConnect();

    try {
        // Retrieve all orders
        const orders: IOrder[] = await Order.find().exec();

        // Count the total number of orders
        const totalOrders: number = await Order.countDocuments().exec();

        return {
            orders: JSON.parse(JSON.stringify(orders)),
            totalOrders: totalOrders,
        };
    } catch (error) {
        console.error("Error fetching order details: ", error);
        throw new Error("Error fetching order details");
    }
}

export async function getOrderById({ orderId }: { orderId: string }): Promise<IOrder | null> {
    try {
        await dbConnect()
        // Find the order by its ID
        const order = await Order.findById(orderId).exec();

        if (!order) {
            throw new Error('Order not found');
        }

        // Return the order
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.error('Error retrieving order:', error);
        throw new Error('Error retrieving order. Please try again later.');
    }
}

export async function changeOrderedProductsStatus({ orderId, productId, statusType }: { orderId: string; productId: string; statusType: string }) {
    try {
        await dbConnect()
        // Fetch the order by orderId
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Find the specific product by productId within the order
        const product = order.products.find((p: any) => p.productId.toString() === productId);
        if (!product) {
            throw new Error('Product not found in order');
        }

        // Update the deliveryStatus of the found product
        product.deliveryStatus = statusType;

        // Save the updated order back to the database
        await order.save();

        return JSON.parse(JSON.stringify({
            success: true,
            message: 'Product status updated successfully',
            order,
        }));
    } catch (error) {
        console.error('Error updating product status:', error);
        throw new Error('Error updating product status. Please try again later.');
    }
}
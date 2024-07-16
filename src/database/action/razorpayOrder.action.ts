"use server"

import dbConnect from "../connect";
import RazorpayOrder, { IRazorpayOrder } from "../models/razorpayOrder.model";

export async function updateRazorpayOrderAfterPayment({razorpayOrderId,razorpayPaymentId}:{razorpayOrderId: string, razorpayPaymentId: string}): Promise<IRazorpayOrder | null> {

    await dbConnect()
    try {
        // Find the Razorpay order by razorpayOrderId
        const razorpayOrder = await RazorpayOrder.findOne({ razorpayOrderId });
        if (!razorpayOrder) {
            console.error('Razorpay order not found');
            return null;
        }

        // Update the payment ID and status
        razorpayOrder.razorpayPaymentId = razorpayPaymentId;
        razorpayOrder.status = 'paid';

        // Save the updated order back to the database
        await razorpayOrder.save();

        return JSON.parse(JSON.stringify("Razorpay order updated successfully"));
    } catch (error) {
        console.error('Error updating Razorpay order:', error);
        throw new Error('Could not update Razorpay order');
    }
}

export async function getRazorpayOrderDetails({ orderId }: { orderId: string }) {
    await dbConnect()
    try {
        // Find the Razorpay order by razorpayOrderId
        const razorpayOrder = await RazorpayOrder.findOne({ orderId:orderId });
        if (!razorpayOrder) {
            console.error('Razorpay order not found');
            return null;
        }

        return JSON.parse(JSON.stringify(
            razorpayOrder
        ));
    } catch (error) {
        console.error('Error updating Razorpay order:', error);
        throw new Error('Could not update Razorpay order');
    }
}
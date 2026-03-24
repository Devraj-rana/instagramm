import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: "Amount must be at least 10 INR" },
        { status: 400 }
      );
    }

    const orderOptions = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Add Funds Error", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
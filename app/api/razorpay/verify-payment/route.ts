import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment verification fields" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Payment Verified", razorpay_payment_id);

      // Ensure this payment hasn't already been credited.
      const { data: existingTxn, error: existingTxnError } = await supabaseAdmin
        .from("wallet_transactions")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "credit")
        .eq("metadata->>razorpay_payment_id", razorpay_payment_id)
        .maybeSingle();

      if (existingTxnError) {
        return NextResponse.json({ success: false, error: existingTxnError.message }, { status: 500 });
      }

      if (existingTxn) {
        return NextResponse.json({ success: true, message: "Payment already processed" });
      }

      // Credit only the amount confirmed by Razorpay order record (paise -> INR).
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      const creditedAmount = Number((Number(razorpayOrder.amount) / 100).toFixed(2));

      if (!Number.isFinite(creditedAmount) || creditedAmount <= 0) {
        return NextResponse.json({ success: false, error: "Invalid Razorpay order amount" }, { status: 400 });
      }

      const { data: profile, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("wallet_balance")
        .eq("id", userId)
        .maybeSingle();
      if (fetchError) {
        return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
      }

      const currentBalance = Number(profile?.wallet_balance ?? 0);
      const { error } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: userId,
          wallet_balance: Number((currentBalance + creditedAmount).toFixed(2)),
          updated_at: new Date().toISOString(),
        });
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Record transaction history
      try {
        await supabaseAdmin
          .from("wallet_transactions")
          .insert({
            user_id: userId,
            amount: creditedAmount,
            type: "credit",
            description: `Wallet top-up via Razorpay`,
            metadata: {
              razorpay_order_id,
              razorpay_payment_id,
              status: "success"
            }
          });
      } catch (logError) {
        console.error("Failed to log transaction:", logError);
        // We don't fail the verification if logging fails, 
        // as the user's balance IS already updated.
      }

      // Send notification email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: 'Funds Added via Razorpay',
            html: `<h2>Funds Added</h2><p>User ID: ${userId}</p><p>Amount: ₹${creditedAmount}</p><p>Payment ID: ${razorpay_payment_id}</p><p>Order ID: ${razorpay_order_id}</p>`
          })
        });
      } catch (e) { /* ignore email errors */ }
      return NextResponse.json({ success: true, creditedAmount, message: "Payment verified and wallet updated" });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Razorpay Verification Error", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}

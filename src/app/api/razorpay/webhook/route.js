import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.wc_order_id;

      if (orderId) {
        // Update WooCommerce order to processing (server-side, safe to use secret keys)
        const wcAuth = Buffer.from(
          `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
        ).toString("base64");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wc/v3/orders/${orderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${wcAuth}`,
            },
            body: JSON.stringify({
              status: "processing",
              transaction_id: payment.id,
              meta_data: [
                { key: "_razorpay_payment_id", value: payment.id },
                { key: "_razorpay_order_id", value: payment.order_id },
              ],
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to update WC order");
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

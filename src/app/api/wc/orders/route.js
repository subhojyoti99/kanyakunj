import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const params = Object.fromEntries(searchParams.entries());
    delete params.orderId;

    if (orderId) {
      const { data } = await api.get(`orders/${orderId}`);
      return NextResponse.json(data);
    }

    const { data } = await api.get("orders", params);
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC orders GET error:", err.message);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data } = await api.post("orders", body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC create order error:", err.message);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const body = await req.json();
    const { data } = await api.put(`orders/${orderId}`, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC update order error:", err.message);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

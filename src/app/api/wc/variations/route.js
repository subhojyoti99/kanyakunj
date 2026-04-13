import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json([], { status: 400 });
    const { data } = await api.get(`products/${productId}/variations`, {
      params: { per_page: 100 },
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC variations error:", err.message);
    return NextResponse.json({ error: "Failed to fetch variations" }, { status: 500 });
  }
}

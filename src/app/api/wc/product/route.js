import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    let data;
    if (id) {
      const res = await api.get(`products/${id}`);
      data = res.data;
    } else {
      const res = await api.get("products", { slug });
      data = res.data[0] || null;
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC product error:", err.message);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

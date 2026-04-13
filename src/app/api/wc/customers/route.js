import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const wcId = searchParams.get("wcId");

    if (wcId) {
      const { data } = await api.get(`customers/${wcId}`);
      return NextResponse.json(data);
    }

    if (email) {
      const { data } = await api.get("customers", { email });
      return NextResponse.json(data[0] || null);
    }

    return NextResponse.json({ error: "email or wcId required" }, { status: 400 });
  } catch (err) {
    console.error("WC customer fetch error:", err.message);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const wcId = searchParams.get("wcId");
    const body = await req.json();

    const { data } = await api.put(`customers/${wcId}`, body);
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC customer update error:", err.message);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

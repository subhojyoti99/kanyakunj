import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { uid, phone, firstName, lastName, email } = await req.json();

    if (!uid || !firstName) {
      return NextResponse.json({ error: "uid and firstName are required" }, { status: 400 });
    }

    // Generate a unique email fallback if none provided
    const sanitizedPhone = phone?.replace(/\D/g, "") || uid.slice(0, 10);
    const customerEmail = email?.trim() || `${sanitizedPhone}@kanyakunj.phone`;

    // Create WooCommerce customer
    // firebase_uid stored as username for reliable future lookups
    const { data: customer } = await api.post("customers", {
      username: uid,                       // firebase_uid → exact match lookup
      email: customerEmail,
      first_name: firstName?.trim() || "",
      last_name: lastName?.trim() || "",
      billing: {
        first_name: firstName?.trim() || "",
        last_name: lastName?.trim() || "",
        email: customerEmail,
        phone: phone || "",
      },
      shipping: {
        first_name: firstName?.trim() || "",
        last_name: lastName?.trim() || "",
      },
      meta_data: [
        { key: "firebase_uid", value: uid },
        { key: "phone", value: phone || "" },
      ],
    });

    return NextResponse.json({
      id: uid,
      wcId: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: phone || "",
    });
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Registration failed";
    console.error("firebase-register error:", msg);

    if (msg.toLowerCase().includes("exists")) {
      return NextResponse.json({ error: "An account already exists for this phone number." }, { status: 409 });
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

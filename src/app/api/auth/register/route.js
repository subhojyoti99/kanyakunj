import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

// Register a new customer
export async function PUT(req) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Create customer in WooCommerce (this also creates a WordPress user)
    const { data: customer } = await api.post("customers", {
      email,
      first_name: firstName || "",
      last_name: lastName || "",
      password,
      username: email,
    });

    return NextResponse.json({
      id: customer.id,
      wcId: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
    });
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Registration failed";
    console.error("WC register error:", msg);

    if (msg.toLowerCase().includes("exists")) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const WC_URL = process.env.NEXT_PUBLIC_WC_URL;

    // Step 1: Verify credentials via WordPress REST API
    // Tries Basic Auth (works on most hosts with Application Passwords enabled)
    let wpUser = null;
    let authVerified = false;

    try {
      const credentials = Buffer.from(`${email}:${password}`).toString("base64");
      const wpRes = await fetch(`${WC_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Basic ${credentials}`,
          "User-Agent": "Kanyakunj-App/1.0",
        },
        cache: "no-store",
      });

      if (wpRes.ok) {
        wpUser = await wpRes.json();
        authVerified = true;
      }
    } catch (e) {
      console.warn("WordPress Basic Auth failed:", e.message);
    }

    // Step 2: If Basic Auth not available, try JWT plugin endpoint
    if (!authVerified) {
      try {
        const jwtRes = await fetch(`${WC_URL}/wp-json/jwt-auth/v1/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
          cache: "no-store",
        });

        if (jwtRes.ok) {
          const jwt = await jwtRes.json();
          if (jwt.token) {
            authVerified = true;
            wpUser = { id: jwt.user_id, name: jwt.user_display_name, email: jwt.user_email };
          }
        }
      } catch (e) {
        console.warn("JWT auth failed:", e.message);
      }
    }

    if (!authVerified) {
      return NextResponse.json(
        { error: "Invalid email or password. If this is correct, please contact support." },
        { status: 401 }
      );
    }

    // Step 3: Get WooCommerce customer record using admin API
    let customer = null;
    try {
      const { data: customers } = await api.get("customers", { email });
      customer = customers?.[0] || null;
    } catch (e) {
      console.warn("WC customer lookup failed:", e.message);
    }

    return NextResponse.json({
      id: wpUser.id || null,
      wcId: customer?.id || null,
      firstName: customer?.first_name || wpUser.name?.split(" ")[0] || "",
      lastName: customer?.last_name || wpUser.name?.split(" ").slice(1).join(" ") || "",
      email: customer?.email || email,
      avatarUrl: wpUser.avatar_urls?.["96"] || null,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}

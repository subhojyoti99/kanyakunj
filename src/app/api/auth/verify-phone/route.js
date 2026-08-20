import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";
import { getAdminAuth } from "../../../../lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token required" }, { status: 400 });
    }

    // 1. Verify the Firebase ID token
    let decoded;
    try {
      decoded = await getAdminAuth().verifyIdToken(idToken);
    } catch (err) {
      console.error("Firebase token verification failed:", err.message);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { uid, phone_number: phone } = decoded;

    // 2. Look up WC customer by firebase_uid stored as username
    let customer = null;
    try {
      const { data: results } = await api.get("customers", {
        search: uid,
        per_page: 1,
      });
      // Verify it's an exact uid match (not a fuzzy hit from search)
      customer = results?.find((c) => c.username === uid) || null;
    } catch (err) {
      console.warn("WC customer lookup error:", err.message);
    }

    if (!customer) {
      // New user — needs to complete registration
      return NextResponse.json({
        needsRegistration: true,
        uid,
        phone: phone || "",
      });
    }

    // 3. Returning user — return session data
    return NextResponse.json({
      id: decoded.uid,
      wcId: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.billing?.phone || phone || "",
    });
  } catch (err) {
    console.error("verify-phone error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import api from "../../../../lib/woocommerce";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // If category_slug passed, resolve it to a category ID first
    if (params.category_slug) {
      const slug = params.category_slug;
      delete params.category_slug;
      try {
        const { data: cats } = await api.get("products/categories", {
          params: { slug, per_page: 1 },
        });
        if (cats.length > 0) {
          params.category = cats[0].id;
        }
      } catch {
        // category not found - proceed without filter
      }
    }

    const { data } = await api.get("products", params);
    return NextResponse.json(data);
  } catch (err) {
    console.error("WC products error:", err.message);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

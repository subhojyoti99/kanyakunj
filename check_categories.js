const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: "https://wp.kanyakunj.com",
  consumerKey: "ck_589e2aa58d8f79a0a555eefdf6c308db2a978680",
  consumerSecret: "cs_e019b422e3e436f82ff4faf80138e45298bd7718",
  version: "wc/v3",
  queryStringAuth: true,
});

async function testFetch() {
  const slug = "kurti";
  console.log("Fetching category with slug:", slug);
  const { data: cats } = await api.get("products/categories", { slug: slug, per_page: 1 });
  console.log("Categories found:", cats.length);
  if (cats.length > 0) {
    const categoryId = cats[0].id;
    console.log("Category ID:", categoryId);
    console.log("Fetching products for category ID:", categoryId);
    const { data: products } = await api.get("products", { category: categoryId });
    console.log("Products found:", products.length);
  }
}
testFetch().catch(console.error);

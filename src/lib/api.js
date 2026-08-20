import api from "./woocommerce";

export async function getProducts(params = {}) {
  try {
    const { data } = await api.get("products", {
      params: {
        per_page: 20,
        status: "publish",
        ...params,
      },
    });
    return data;
  } catch (err) {
    console.error("getProducts error:", err.message);
    return [];
  }
}

export async function getProduct(id) {
  try {
    const { data } = await api.get(`products/${id}`);
    return data;
  } catch (err) {
    console.error("getProduct error:", err.message);
    return null;
  }
}

export async function getProductBySlug(slug) {
  try {
    const { data } = await api.get("products", {
      params: { slug },
    });
    return data[0] || null;
  } catch (err) {
    console.error("getProductBySlug error:", err.message);
    return null;
  }
}

export async function getProductVariations(productId) {
  try {
    const { data } = await api.get(`products/${productId}/variations`, {
      params: { per_page: 100 },
    });
    return data;
  } catch (err) {
    console.error("getProductVariations error:", err.message);
    return [];
  }
}

export async function getCategories() {
  try {
    const { data } = await api.get("products/categories", {
      params: {
        per_page: 50,
        hide_empty: true,
      },
    });
    return data;
  } catch (err) {
    console.error("getCategories error:", err.message);
    return [];
  }
}



export async function getProductsByCategory(categoryId, params = {}) {
  return getProducts({ category: categoryId, ...params });
}

export async function createOrder(orderData) {
  try {
    const { data } = await api.post("orders", orderData);
    return data;
  } catch (err) {
    console.error("createOrder error:", err);
    throw err;
  }
}

export async function updateOrder(orderId, updateData) {
  try {
    const { data } = await api.put(`orders/${orderId}`, updateData);
    return data;
  } catch (err) {
    console.error("updateOrder error:", err);
    throw err;
  }
}


export async function getAllProducts(token) {
  const response = await fetch(
    `${API_URL}/api/products`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load products"
    );
  }

  return data;
}
const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

export async function getProductsByShop(shopId, token) {
  const response = await fetch(
    `${API_URL}/api/products/shop/${shopId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load shop products"
    );
  }

  return data;
}

export async function getProductById(productId, token) {
  const response = await fetch(
    `${API_URL}/api/products/${productId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load product"
    );
  }

  return data;
}

export async function createProduct(productData, token) {
  const response = await fetch(
    `${API_URL}/api/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create product"
    );
  }

  return data;
}

export async function updateProduct(
  productId,
  productData,
  token
) {
  const response = await fetch(
    `${API_URL}/api/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update product"
    );
  }

  return data;
}


export async function deleteProduct(
  productId,
  token
) {
  const response = await fetch(
    `${API_URL}/api/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.text();

  if (!response.ok) {
    throw new Error(
      data || "Unable to delete product"
    );
  }

  return data;
}
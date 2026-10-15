const API_URL = "Vhttps://neighbourhub-backend-uns0.onrender.com";

export async function getCart(token) {
  const response = await fetch(
    `${API_URL}/api/cart`,
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
      data.message || "Unable to load cart"
    );
  }

  return data;
}

export async function addToCart(
  productId,
  quantity,
  token
) {
  const response = await fetch(
    `${API_URL}/api/cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to add product to cart"
    );
  }

  return data;
}

export async function updateCartItem(
  cartItemId,
  quantity,
  token
) {
  const response = await fetch(
    `${API_URL}/api/cart/${cartItemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update cart"
    );
  }

  return data;
}

export async function removeFromCart(
  cartItemId,
  token
) {
  const response = await fetch(
    `${API_URL}/api/cart/${cartItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to remove item"
    );
  }

  return data;
}

export async function clearCart(token) {
  const response = await fetch(
    `${API_URL}/api/cart`,
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
      data || "Unable to clear cart"
    );
  }

  return data;
}
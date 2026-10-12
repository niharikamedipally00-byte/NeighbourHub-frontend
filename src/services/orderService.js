const API_URL = "http://localhost:8080";

export async function createOrder(orderData, token) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to place order"
    );
  }

  return data;
}

export async function getMyOrders(token) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load orders"
    );
  }

  return data;
}

export async function getOrderById(orderId, token) {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}`,
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
      data.message || "Unable to load order"
    );
  }

  return data;
}

export async function cancelOrder(orderId, token) {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to cancel order"
    );
  }

  return data;
}
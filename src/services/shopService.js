const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

export async function getAllShops(token) {
  const response = await fetch(`${API_URL}/api/shops`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load shops");
  }

  return data;
}

export async function getShopById(id, token) {
  const response = await fetch(`${API_URL}/api/shops/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load shop");
  }

  return data;
}

export async function createShop(shopData, token) {
  const response = await fetch(`${API_URL}/api/shops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shopData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create shop");
  }

  return data;
}
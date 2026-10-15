const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

function getToken() {
  return localStorage.getItem("neighbourhub_token");
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Wishlist request failed"
    );
  }

  return data;
}

export async function addToWishlist(
  userId,
  productId
) {
  const response = await fetch(
    `${API_URL}/${userId}/${productId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return handleResponse(response);
}

export async function getWishlist(userId) {
  const response = await fetch(
    `${API_URL}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return handleResponse(response);
}

export async function checkWishlist(
  userId,
  productId
) {
  const response = await fetch(
    `${API_URL}/${userId}/check/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return handleResponse(response);
}

export async function removeFromWishlist(
  userId,
  productId
) {
  const response = await fetch(
    `${API_URL}/${userId}/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return handleResponse(response);
}
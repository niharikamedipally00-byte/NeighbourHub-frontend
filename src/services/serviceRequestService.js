const API_URL = "https://neighbourhub-backend-uns0.onrender.com";

function getToken() {
  return localStorage.getItem("neighbourhub_token");
}

export async function createServiceRequest(requestData) {
  const response = await fetch(`${API_URL}/service-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create service request");
  }

  return data;
}

export async function getCustomerServiceRequests(customerId) {
  const response = await fetch(
    `${API_URL}/service-requests/customer/${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load service requests");
  }

  return data;
}

export async function getProviderServiceRequests(providerId) {
  const response = await fetch(
    `${API_URL}/service-requests/provider/${providerId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load service requests");
  }

  return data;
}

export async function getProviderRequestsByStatus(
  providerId,
  status
) {
  const response = await fetch(
    `${API_URL}/service-requests/provider/${providerId}/status/${status}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load service requests");
  }

  return data;
}

export async function updateServiceRequestStatus(
  requestId,
  status
) {
  const response = await fetch(
    `${API_URL}/service-requests/${requestId}/status?status=${status}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update service request");
  }

  return data;
}

export async function getServiceRequestById(requestId) {
  const response = await fetch(
    `${API_URL}/service-requests/${requestId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load service request");
  }

  return data;
}
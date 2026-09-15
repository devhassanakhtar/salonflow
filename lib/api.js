const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export async function loginRequest(email, password) {
  return apiRequest("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getDashboardStats() {
  return apiRequest("/v1/dashboard");
}

export async function getCustomers(query = "") {
  return apiRequest(`/v1/customers${query}`);
}

export async function createCustomer(customerData) {
  return apiRequest(`/v1/customers`, {
    method: "POST",
    body: JSON.stringify(customerData),
  });
}

export async function getCustomer(id) {
  return apiRequest(`/v1/customers/${id}`);
}

export async function deleteCustomer(id) {
  return apiRequest(`/v1/customers/${id}`, {
    method: "DELETE",
  });
}

export async function updateCustomer(id, customerData) {
  return apiRequest(`/v1/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(customerData),
  });
}

export async function getAppointments(query = "") {
  return apiRequest(`/v1/appointments${query}`);
}

export async function getMe() {
  return apiRequest("/v1/auth/me");
}

export async function confirmAppointment(id) {
  return apiRequest(`/v1/appointments/${id}/confirm`, {
    method: "POST",
  });
}

export async function cancelAppointment(id) {
  return apiRequest(`/v1/appointments/${id}/cancel`, {
    method: "POST",
  });
}

export async function deleteAppointment(id) {
  return apiRequest(`/v1/appointments/${id}`, {
    method: "DELETE",
  });
}

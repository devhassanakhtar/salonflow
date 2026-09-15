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

  const text = await res.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  // if (!res.ok) {
  //   throw new Error(data?.message || "Something went wrong");
  // }

  if (!res.ok) {
    console.log("API ERROR:", {
      status: res.status,
      data,
    });

    throw new Error(data?.message || "Something went wrong");
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

export async function createAppointment(data) {
  return apiRequest("/v1/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteAppointment(id) {
  return apiRequest(`/v1/appointments/${id}`, {
    method: "DELETE",
  });
}

export async function getStaff(page = 1) {
  return apiRequest(`/v1/staff?per_page=10&page=${page}`);
}

export async function getStaffMember(id) {
  return apiRequest(`/v1/staff/${id}`);
}

export async function getAppointment(id) {
  return apiRequest(`/v1/appointments/${id}`);
}

export async function updateAppointment(id, data) {
  return apiRequest(`/v1/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateStaff(id, staffData) {
  return apiRequest(`/v1/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(staffData),
  });
}

export async function createStaff(data) {
  return apiRequest("/v1/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getService(id) {
  return apiRequest(`/v1/services/${id}`);
}

export async function getServices(page = 1) {
  return apiRequest(`/v1/services?per_page=10&page=${page}`);
}

export async function updateService(id, serviceData) {
  return apiRequest(`/v1/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(serviceData),
  });
}

export async function deleteService(id) {
  return apiRequest(`/v1/services/${id}`, {
    method: "DELETE",
  });
}

export async function logout() {
  return apiRequest("/v1/auth/logout", {
    method: "POST",
  });
}

export async function deleteUser(id) {
  return apiRequest(`/v1/users/${id}`, {
    method: "DELETE",
  });
}

export async function getUsers(page = 1, search = "") {
  return apiRequest(
    `/v1/users?per_page=10&page=${page}&search=${encodeURIComponent(search)}`,
  );
}

export async function getUser(id) {
  return apiRequest(`/v1/users/${id}`);
}

export async function createUser(userData) {
  return apiRequest("/v1/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id, userData) {
  return apiRequest(`/v1/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function getNotifications(page = 1) {
  return apiRequest(`/v1/notifications?per_page=10&page=${page}`);
}

export async function markNotificationAsRead(id) {
  return apiRequest(`/v1/notifications/${id}/read`, {
    method: "POST",
  });
}

export async function markAllNotificationsAsRead() {
  return apiRequest("/v1/notifications/read-all", {
    method: "POST",
  });
}


import { apiRequest } from "./api";

export const getCustomersList = (page = 1, search = "") => {
  const params = new URLSearchParams();

  params.set("per_page", "15");
  params.set("page", String(page));

  if (search.trim()) {
    params.set("q", search.trim());
  }

  return apiRequest(`/v1/customers?${params.toString()}`);
};

export const getCustomer = (id) => {
  return apiRequest(`/v1/customers/${id}`);
};

export const createCustomer = (data) => {
  return apiRequest("/v1/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCustomer = (id, data) => {
  return apiRequest(`/v1/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteCustomer = (id) => {
  return apiRequest(`/v1/customers/${id}`, {
    method: "DELETE",
  });
};
import { api } from "@/config/axios.config";

// Get all users with optional role filter
export const getUsers = async (role = null) => {
  try {
    let endpoint = "/dashboard/users";
    if (role) {
      endpoint += `?roles[0]=${role}`;
    }
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single user by ID
export const getUser = async (id) => {
  try {
    const response = await api.get(`/dashboard/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/dashboard/users", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/dashboard/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/dashboard/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get users by role (teachers)
export const getTeachers = async () => {
  return getUsers('teacher');
};

// Get users by role (quality assurance)
export const getQualityUsers = async () => {
  return getUsers('quality');
}; 
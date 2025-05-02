import { api } from "@/config/axios.config";

export const getEvents = async (selectedCategory) => {
  try {
    const response = await api.get(`/api/calendars`);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};
export const getCategories = async () => {
  try {
    const response = await api.get("/api/calendars/categories");
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};
export const createEvent = async (data) => {
  try {
    const response = await api.post("/api/calendars", data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// delete
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/api/calendars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// update
export const updateEvent = async (id, data) => {
  try {
    const response = await api.put(`/api/calendars/${id}`, data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

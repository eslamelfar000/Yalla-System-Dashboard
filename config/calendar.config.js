import { api } from "@/config/axios.config";

export const getEvents = async (selectedCategory) => {
  try {
    const response = await api.get(`http://localhost:3000/api/calendars`);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};
export const getCategories = async () => {
  try {
    const response = await api.get("http://localhost:3000/api/calendars/categories");
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};
export const createEvent = async (data) => {
  try {
    const response = await api.post("http://localhost:3000/api/calendars", data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// delete
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`http://localhost:3000/api/calendars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// update
export const updateEvent = async (id, data) => {
  try {
    const response = await api.put(`http://localhost:3000/api/calendars/${id}`, data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

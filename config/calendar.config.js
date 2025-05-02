import { api } from "@/config/axios.config";
import axios from "axios";

export const getEvents = async (selectedCategory) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/calendars`);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};
export const getCategories = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/calendars/categories");
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};
export const createEvent = async (data) => {
  try {
    const response = await axios.post("http://localhost:3000/api/calendars", data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// delete
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/calendars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// update
export const updateEvent = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/calendars/${id}`, data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

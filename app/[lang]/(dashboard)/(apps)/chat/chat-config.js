import { api } from "@/config/axios.config";

// Fetch contacts
export const getContacts = async () => {
  const response = await api.get("/api/chat");  // Use the Next.js API route
  return response.data;
};

// Fetch messages for a specific contact
export const getMessages = async (id) => {
  if (!id) return [];

  try {
    const response = await api.get(`/api/chat/messages/${id}`);  // Next.js API route
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Delete message
export const deleteMessage = async (obj) => {
  console.log("Object to be sent:", obj); // Log the object for debugging
  try {
    await api.delete(`/api/chat/messages/${obj.selectedChatId}`, { data: obj });
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// Fetch user profile
export const getProfile = async () => {
  const response = await api.get("/api/chat/profile-data");  // Next.js API route
  return response.data;
};

// Send a new message
export const sendMessage = async (msg) => {
  const response = await api.post("/api/chat/messages", msg);  // Next.js API route
  return response.data;
};

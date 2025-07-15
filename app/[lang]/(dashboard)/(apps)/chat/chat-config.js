import { api } from "@/config/axios.config";

// Get all chats with pagination
export const getAllChats = async (page = 1) => {
  try {
    const response = await api.get(`/chat?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return { data: [], success: false, message: "Failed to fetch chats" };
  }
};

// Get single chat info
export const getChatInfo = async (chatId) => {
  try {
    const response = await api.get(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat info:", error);
    return { data: {}, success: false, message: "Failed to fetch chat info" };
  }
};

// Get chat messages with pagination
export const getChatMessages = async (chatId, page = 1) => {
  try {
    const response = await api.get(`/chat_message?chat_id=${chatId}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return { data: [], success: false, message: "Failed to fetch messages" };
  }
};

// Create new chat
export const createChat = async (chatData) => {
  try {
    const response = await api.post("/chat", chatData);
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, message: "Failed to create chat" };
  }
};

// Delete chat message
export const deleteChatMessage = async (messageId) => {
  try {
    const response = await api.delete(`/chat_message/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, message: "Failed to delete message" };
  }
};

// Get available students for teacher (placeholder - will be updated when endpoint is provided)
export const getAvailableStudents = async (teacherId) => {
  try {
    // This will be updated when you provide the endpoint
    const response = await api.get(`/available-students/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching available students:", error);
    return { data: [], success: false, message: "Failed to fetch students" };
  }
};

// Get available users for creating chats
export const getAvailableUsers = async () => {
  try {
    const response = await api.get("/users/available");
    return response.data;
  } catch (error) {
    console.error("Error fetching available users:", error);
    return { data: [], success: false, message: "Failed to fetch users" };
  }
};

// Send message (updated to use new endpoint)
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat_message", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, message: "Failed to send message" };
  }
};

// Get user profile info
export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: {}, success: false, message: "Failed to fetch profile" };
  }
};

// Legacy functions for backward compatibility
export const getContacts = async () => {
  return getAllChats(1);
};

export const getMessages = async (chatId) => {
  if (!chatId) return { data: [], contact: {} };
  return getChatMessages(chatId, 1);
};

export const deleteMessage = async (obj) => {
  return deleteChatMessage(obj.messageId || obj.index);
};

export const getProfile = async () => {
  return getUserProfile();
};

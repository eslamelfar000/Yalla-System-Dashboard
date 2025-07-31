import { api } from "@/config/axios.config";

// Get all chats with pagination - handles both admin and teacher roles
export const getAllChats = async (page = 1, userRole = null) => {
  try {
    // Use different endpoints based on user role
    const endpoint = userRole === "admin" 
      ? `dashboard/chats`
      : `chat?page=${page}`;
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return { data: [], success: false, message: "Failed to fetch chats" };
  }
};

// Get single chat info - handles both admin and teacher roles
export const getChatInfo = async (chatId, userRole = null) => {
  try {
    // Use different endpoints based on user role
    const endpoint = userRole === "admin" 
      ? `dashboard/chats/${chatId}`
      : `chat/${chatId}`;
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat info:", error);
    return { data: {}, success: false, message: "Failed to fetch chat info" };
  }
};

// Get chat messages with pagination - handles both admin and teacher roles
export const getChatMessages = async (chatId, page = 1, userRole = null) => {
  try {
    // For admin, the single chat endpoint already includes messages
    if (userRole === "admin") {
      // Get chat info which includes messages
      const chatResponse = await api.get(`dashboard/chats/${chatId}`);
      const chatData = chatResponse.data;
      
      if (chatData.data && chatData.data.messages) {
        // Return messages from the chat info response
        return {
          data: chatData.data.messages,
          success: true,
          message: "Messages fetched successfully"
        };
      }
    }
    
    // Fallback to separate messages endpoint for teacher or if messages not in chat response
    const endpoint = userRole === "admin" 
      ? `dashboard/chats/${chatId}/messages?page=${page}`
      : `chat_message?chat_id=${chatId}&page=${page}`;
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return { data: [], success: false, message: "Failed to fetch messages" };
  }
};

// Mark messages as read in a chat
export const markMessagesAsRead = async (chatId, userRole = null) => {
  try {
    // Use different endpoints based on user role
    const endpoint = userRole === "admin" 
      ? `dashboard/chats/${chatId}/mark-read`
      : `chat/${chatId}/mark-read`;
    
    const response = await api.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, message: "Failed to mark messages as read" };
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

// Send message (updated to handle attachments)
export const sendMessage = async (messageData) => {
  try {
    // Check if we have attachments that need file upload
    const hasFileAttachments = messageData.attachments?.some(att => att.file);
    
    if (hasFileAttachments) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('chat_id', messageData.chat_id);
      formData.append('message', messageData.message || ''); // Send as string
      formData.append('time', messageData.time);
      
      // Add file attachments
      messageData.attachments.forEach((attachment, index) => {
        if (attachment.file) {
          formData.append(`attach_type`, attachment.type);
          formData.append(`attach_name`, attachment.name);
          formData.append(`attach_size`, attachment.size);
          formData.append(`attachments`, attachment.file);
        }
      });
      
      const response = await api.post("/chat_message", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular JSON request for text-only messages
      const jsonData = {
        chat_id: messageData.chat_id,
        message: messageData.message || '', // Send as string
        time: messageData.time,
        replayMetadata: messageData.replayMetadata || false,
      };
      
      const response = await api.post("/chat_message", jsonData);
      return response.data;
    }
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

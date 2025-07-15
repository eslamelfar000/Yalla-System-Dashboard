import { api } from "@/config/axios.config";
import { getAuthToken } from "@/lib/auth-utils";

export const getEvents = async (selectedCategory) => {
  try {
    const response = await api.get(`/dashboard/calendar`);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/dashboard/calendar/categories");
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

export const createEvent = async (data) => {
  try {
    const response = await api.post("/dashboard/calendar", data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// delete
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/dashboard/calendar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// update
export const updateEvent = async (id, data) => {
  try {
    const response = await api.post(`/dashboard/calendar/${id}`, data);
    return response.data;
  }catch (error) {
    console.error("Error deleting message:", error);
    // Handle error gracefully
  }
};

// Teacher session functions using external API
export const getTeacherSessions = async (teacherId = null) => {
  try {
    // Try different endpoint variations
    let url = `/dashboard/calendar/${teacherId}`;
    
    let response = await api.get(url);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher sessions:", error);
    console.error("Error details:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
    
    // If first endpoint fails, try alternative
    try {
      const url = `/dashboard/calendars/${teacherId}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (secondError) {
      console.error("Alternative endpoint also failed:", secondError);
      console.error("Second error details:", secondError.response?.data);
      return { success: false, message: "Failed to fetch sessions", data: [] };
    }
  }
};

export const createTeacherSession = async (data, userRole = null) => {
  try {
    const token = getAuthToken();
    
    // Transform data to match your API format
    const apiData = {
      day: data.date,
      start_time: data.start_time.substring(0, 5), // Remove seconds
      end_time: data.end_time.substring(0, 5), // Remove seconds
    };
    
    // Handle different roles
    if (userRole === "quality" && data.teacher_id) {
      // Quality role: create session for specific teacher
      apiData.teacher_id = data.teacher_id;
    } else if (userRole === "teacher") {
      // Teacher role: create own session (no teacher_id needed)
    }
    
    const response = await api.post("/dashboard/calendar", apiData);
    return response.data;
  } catch (error) {
    console.error("Error creating teacher session:", error);
    console.error("Create error details:", error.response?.data);
    console.error("Create error status:", error.response?.status);
    console.error("Create error message:", error.message);
    
    // Try alternative endpoint
    try {
      const apiData = {
        day: data.date,
        start_time: data.start_time.substring(0, 5),
        end_time: data.end_time.substring(0, 5),
      };
      
      // Handle different roles
      if (userRole === "quality" && data.teacher_id) {
        apiData.teacher_id = data.teacher_id;
      }
      
      const response = await api.post("/dashboard/calendars", apiData);
      return response.data;
    } catch (secondError) {
      console.error("Alternative create endpoint also failed:", secondError);
      console.error("Second create error details:", secondError.response?.data);
      return { success: false, message: "Failed to create session" };
    }
  }
};

export const updateTeacherSession = async (id, data) => {
  try {
    // Transform data to match your API format
    const apiData = {
      day: data.date,
      start_time: data.start_time.substring(0, 5), // Remove seconds
      end_time: data.end_time.substring(0, 5), // Remove seconds
    };
    
    const response = await api.post(`/dashboard/calendar/${id}`, apiData);
    return response.data;
  } catch (error) {
    console.error("Error updating teacher session:", error);
    
    // Try alternative endpoint
    try {
      const apiData = {
        day: data.date,
        start_time: data.start_time.substring(0, 5),
        end_time: data.end_time.substring(0, 5),
      };
      
      const response = await api.post(`/dashboard/calendars/${id}`, apiData);
      return response.data;
    } catch (secondError) {
      console.error("Alternative update endpoint also failed:", secondError);
      return { success: false, message: "Failed to update session" };
    }
  }
};

export const deleteTeacherSession = async (id) => {
  try {
    const response = await api.delete(`/dashboard/calendar/${id}`);
    return response.data;
  } catch (error) {
    
    // Try alternative endpoint
    try {
      const response = await api.delete(`/dashboard/calendars/${id}`);
      return response.data;
    } catch (secondError) {
      return { success: false, message: "Failed to delete session" };
    }
  }
};

// Book session for quality role
export const bookSession = async (sessionId, bookingData, userRole = null) => {
  try {
    const token = getAuthToken();
    
    const apiData = {
      user_session_id: sessionId,
    };
    
    const response = await api.post(`/dashboard/calendar/sessions/book`, apiData);
    return response.data;
  } catch (error) {
    console.error("Error booking session:", error);
    console.error("Book error details:", error.response?.data);
    console.error("Book error status:", error.response?.status);
    console.error("Book error message:", error.message);
    
    return { success: false, message: "Failed to book session" };
  }
};

export const getTeacherSession = async (id) => {
  try {
    const response = await api.get(`/dashboard/calendar/${id}`);
    return response.data;
  } catch (error) {
    
    // Try alternative endpoint
    try {
      const response = await api.get(`/dashboard/calendars/${id}`);
      return response.data;
    } catch (secondError) {
      return { success: false, message: "Failed to fetch session" };
    }
  }
};

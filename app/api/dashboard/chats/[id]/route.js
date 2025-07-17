import { NextResponse } from "next/server";

// Mock data for admin chat details - replace with actual database queries
const adminChatDetails = {
  1: {
    id: 1,
    student: {
      id: 101,
      name: "Ahmed Ali",
      image: "/images/avatar/avatar-1.jpg",
      email: "ahmed.ali@example.com",
      phone: "+966501234567"
    },
    teacher: {
      id: 201,
      name: "Sarah Johnson",
      image: "/images/avatar/avatar-2.jpg",
      email: "sarah.johnson@example.com",
      phone: "+966509876543"
    },
    last_message: "Hello, how are you?",
    last_message_time: "2024-01-15T10:30:00Z",
    unread_count: 2,
    status: "active",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  2: {
    id: 2,
    student: {
      id: 102,
      name: "Fatima Hassan",
      image: "/images/avatar/avatar-3.jpg",
      email: "fatima.hassan@example.com",
      phone: "+966501234568"
    },
    teacher: {
      id: 202,
      name: "Michael Brown",
      image: "/images/avatar/avatar-4.jpg",
      email: "michael.brown@example.com",
      phone: "+966509876544"
    },
    last_message: "Thank you for the lesson",
    last_message_time: "2024-01-15T09:15:00Z",
    unread_count: 0,
    status: "active",
    created_at: "2024-01-12T09:00:00Z",
    updated_at: "2024-01-15T09:15:00Z"
  },
  3: {
    id: 3,
    student: {
      id: 103,
      name: "Omar Khalil",
      image: "/images/avatar/avatar-5.jpg",
      email: "omar.khalil@example.com",
      phone: "+966501234569"
    },
    teacher: {
      id: 203,
      name: "Emily Davis",
      image: "/images/avatar/avatar-6.jpg",
      email: "emily.davis@example.com",
      phone: "+966509876545"
    },
    last_message: "Can we schedule a session?",
    last_message_time: "2024-01-14T16:45:00Z",
    unread_count: 1,
    status: "active",
    created_at: "2024-01-13T10:00:00Z",
    updated_at: "2024-01-14T16:45:00Z"
  }
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        data: {},
        success: false,
        message: "Chat ID is required"
      }, { status: 400 });
    }

    const chatId = parseInt(id);
    const chatDetails = adminChatDetails[chatId];

    if (!chatDetails) {
      return NextResponse.json({
        data: {},
        success: false,
        message: "Chat not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      data: chatDetails,
      success: true,
      message: "Chat details fetched successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin chat details:", error);
    return NextResponse.json({
      data: {},
      success: false,
      message: "Failed to fetch chat details"
    }, { status: 500 });
  }
} 
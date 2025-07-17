import { NextResponse } from "next/server";

// Mock data for admin chat messages - replace with actual database queries
const adminChatMessages = {
  1: [
    {
      id: 1,
      message: "Hello, how are you?",
      time: "2024-01-15T10:30:00Z",
      sender_id: 101,
      sender_type: "student",
      sender_name: "Ahmed Ali",
      sender_image: "/images/avatar/avatar-1.jpg"
    },
    {
      id: 2,
      message: "I'm doing well, thank you! How about you?",
      time: "2024-01-15T10:32:00Z",
      sender_id: 201,
      sender_type: "teacher",
      sender_name: "Sarah Johnson",
      sender_image: "/images/avatar/avatar-2.jpg"
    },
    {
      id: 3,
      message: "I'm good too. Can we schedule our next lesson?",
      time: "2024-01-15T10:35:00Z",
      sender_id: 101,
      sender_type: "student",
      sender_name: "Ahmed Ali",
      sender_image: "/images/avatar/avatar-1.jpg"
    }
  ],
  2: [
    {
      id: 4,
      message: "Thank you for the lesson today",
      time: "2024-01-15T09:15:00Z",
      sender_id: 102,
      sender_type: "student",
      sender_name: "Fatima Hassan",
      sender_image: "/images/avatar/avatar-3.jpg"
    },
    {
      id: 5,
      message: "You're welcome! You did great today",
      time: "2024-01-15T09:17:00Z",
      sender_id: 202,
      sender_type: "teacher",
      sender_name: "Michael Brown",
      sender_image: "/images/avatar/avatar-4.jpg"
    }
  ],
  3: [
    {
      id: 6,
      message: "Can we schedule a session?",
      time: "2024-01-14T16:45:00Z",
      sender_id: 103,
      sender_type: "student",
      sender_name: "Omar Khalil",
      sender_image: "/images/avatar/avatar-5.jpg"
    },
    {
      id: 7,
      message: "Of course! What time works for you?",
      time: "2024-01-14T16:50:00Z",
      sender_id: 203,
      sender_type: "teacher",
      sender_name: "Emily Davis",
      sender_image: "/images/avatar/avatar-6.jpg"
    }
  ]
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = 20;
    
    if (!id) {
      return NextResponse.json({
        data: [],
        success: false,
        message: "Chat ID is required"
      }, { status: 400 });
    }

    const chatId = parseInt(id);
    const messages = adminChatMessages[chatId] || [];

    // Paginate the messages
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMessages = messages.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedMessages,
      success: true,
      message: "Messages fetched successfully",
      pagination: {
        current_page: page,
        last_page: Math.ceil(messages.length / pageSize),
        total: messages.length,
        per_page: pageSize,
        has_more: endIndex < messages.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin chat messages:", error);
    return NextResponse.json({
      data: [],
      success: false,
      message: "Failed to fetch messages"
    }, { status: 500 });
  }
} 
import { NextResponse } from "next/server";

// Mock data for admin chats - replace with actual database queries
const adminChats = [
  {
    id: 1,
    student_name: "Ahmed Ali",
    teacher_name: "Sarah Johnson",
    last_message: "Hello, how are you?",
    last_message_time: "2024-01-15T10:30:00Z",
    unread_count: 2,
    student_image: "/images/avatar/avatar-1.jpg",
    teacher_image: "/images/avatar/avatar-2.jpg",
    status: "active"
  },
  {
    id: 2,
    student_name: "Fatima Hassan",
    teacher_name: "Michael Brown",
    last_message: "Thank you for the lesson",
    last_message_time: "2024-01-15T09:15:00Z",
    unread_count: 0,
    student_image: "/images/avatar/avatar-3.jpg",
    teacher_image: "/images/avatar/avatar-4.jpg",
    status: "active"
  },
  {
    id: 3,
    student_name: "Omar Khalil",
    teacher_name: "Emily Davis",
    last_message: "Can we schedule a session?",
    last_message_time: "2024-01-14T16:45:00Z",
    unread_count: 1,
    student_image: "/images/avatar/avatar-5.jpg",
    teacher_image: "/images/avatar/avatar-6.jpg",
    status: "active"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedChats = adminChats.slice(startIndex, endIndex);
    
    return NextResponse.json({
      data: paginatedChats,
      success: true,
      message: "Admin chats fetched successfully",
      pagination: {
        current_page: page,
        last_page: Math.ceil(adminChats.length / pageSize),
        total: adminChats.length,
        per_page: pageSize
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin chats:", error);
    return NextResponse.json({
      data: [],
      success: false,
      message: "Failed to fetch admin chats"
    }, { status: 500 });
  }
} 
import { NextResponse } from "next/server";

// Get current date and future dates for mock data
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Mock data for teacher sessions (same as in route.js)
const teacherSessions = [
  {
    id: 1,
    title: "English Session - John Doe",
    date: formatDate(today),
    start_time: "09:00:00",
    end_time: "10:00:00",
    is_booked: true,
    student: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890"
    },
    coaching: 1, // 0 = poor, 1 = good
    teacher_id: 1,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    title: "Math Session - Available",
    date: formatDate(today),
    start_time: "11:00:00",
    end_time: "12:00:00",
    is_booked: false,
    student: null,
    coaching: 0,
    teacher_id: 1,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 3,
    title: "Science Session - Sarah Smith",
    date: formatDate(tomorrow),
    start_time: "14:00:00",
    end_time: "15:00:00",
    is_booked: true,
    student: {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      phone: "+1234567891"
    },
    coaching: 1,
    teacher_id: 1,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 4,
    title: "History Session - Available",
    date: formatDate(tomorrow),
    start_time: "16:00:00",
    end_time: "17:00:00",
    is_booked: false,
    student: null,
    coaching: 0,
    teacher_id: 1,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 5,
    title: "Physics Session - Available",
    date: formatDate(dayAfterTomorrow),
    start_time: "10:00:00",
    end_time: "11:00:00",
    is_booked: false,
    student: null,
    coaching: 0,
    teacher_id: 1,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  }
];

export async function GET(request, { params }) {
  try {
    console.log("GET /api/dashboard/calendar/[id] called with params:", params);
    const { id } = params;
    const session = teacherSessions.find(s => s.id === parseInt(id));

    if (!session) {
      return NextResponse.json({
        status: "fail",
        message: "Session not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "Session retrieved successfully",
      data: session
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/calendar/[id]:", error);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    console.log("PUT /api/dashboard/calendar/[id] called with params:", params);
    const { id } = params;
    const body = await request.json();
    console.log("Request body:", body);
    
    const { date, start_time, end_time } = body;

    // Find the session
    const sessionIndex = teacherSessions.findIndex(s => s.id === parseInt(id));
    
    if (sessionIndex === -1) {
      return NextResponse.json({
        status: "fail",
        message: "Session not found"
      }, { status: 404 });
    }

    // Validate required fields
    if (!date || !start_time || !end_time) {
      return NextResponse.json({
        status: "fail",
        message: "Missing required fields: date, start_time, end_time"
      }, { status: 400 });
    }

    // Update the session
    const updatedSession = {
      ...teacherSessions[sessionIndex],
      date,
      start_time,
      end_time,
      updated_at: new Date().toISOString()
    };

    teacherSessions[sessionIndex] = updatedSession;
    console.log("Updated session:", updatedSession);

    return NextResponse.json({
      status: "success",
      message: "Session updated successfully",
      data: updatedSession
    });
  } catch (error) {
    console.error("Error in PUT /api/dashboard/calendar/[id]:", error);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log("DELETE /api/dashboard/calendar/[id] called with params:", params);
    const { id } = params;
    const sessionIndex = teacherSessions.findIndex(s => s.id === parseInt(id));
    
    if (sessionIndex === -1) {
      return NextResponse.json({
        status: "fail",
        message: "Session not found"
      }, { status: 404 });
    }

    // Remove the session
    const deletedSession = teacherSessions.splice(sessionIndex, 1)[0];
    console.log("Deleted session:", deletedSession);

    return NextResponse.json({
      status: "success",
      message: "Session deleted successfully",
      data: deletedSession
    });
  } catch (error) {
    console.error("Error in DELETE /api/dashboard/calendar/[id]:", error);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: error.message
    }, { status: 500 });
  }
} 
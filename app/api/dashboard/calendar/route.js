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

// Mock data for teacher sessions with current dates
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

export async function GET(request) {
  try {
    console.log("GET /api/dashboard/calendar called");
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');
    const date = searchParams.get('date');

    console.log("Teacher ID:", teacherId);
    console.log("Date:", date);

    let filteredSessions = teacherSessions;

    // Filter by teacher_id if provided
    if (teacherId) {
      filteredSessions = filteredSessions.filter(session => session.teacher_id === parseInt(teacherId));
    }

    // Filter by date if provided
    if (date) {
      filteredSessions = filteredSessions.filter(session => session.date === date);
    }

    console.log("Filtered sessions:", filteredSessions);

    return NextResponse.json({
      status: "success",
      message: "Sessions retrieved successfully",
      data: filteredSessions
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/calendar:", error);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("POST /api/dashboard/calendar called");
    const body = await request.json();
    console.log("Request body:", body);
    
    const { date, start_time, end_time, teacher_id } = body;

    // Validate required fields
    if (!date || !start_time || !end_time || !teacher_id) {
      console.log("Missing required fields:", { date, start_time, end_time, teacher_id });
      return NextResponse.json({
        status: "fail",
        message: "Missing required fields: date, start_time, end_time, teacher_id"
      }, { status: 400 });
    }

    // Create new session
    const newSession = {
      id: teacherSessions.length + 1,
      title: "New Session - Available",
      date,
      start_time,
      end_time,
      is_booked: false,
      student: null,
      coaching: 0,
      teacher_id: parseInt(teacher_id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    teacherSessions.push(newSession);
    console.log("Created new session:", newSession);

    return NextResponse.json({
      status: "success",
      message: "Session created successfully",
      data: newSession
    });
  } catch (error) {
    console.error("Error in POST /api/dashboard/calendar:", error);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: error.message
    }, { status: 500 });
  }
} 
import { NextResponse } from "next/server";

// Mock data for lessons board
const lessonsBoardData = [
  {
    student: {
      id: 8,
      name: "Eslam-quality",
      email: "eslamsaber708@gmail.com",
      phone: "01164376176",
      role: "quality",
      provider_id: "",
      image: "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
      device_token: "",
      email_verified_at: "",
      location: "",
      join_at: "2025-05-31T18:24:23.000000Z",
      status: "active",
      review_lesson_price: 60,
      coaching_lesson_price: 50,
      debt: 300,
      assiend_teacher: null,
      sessions: 0,
      type: null,
      teacher: null,
      sessions_count: 5,
      sessions_count_done: 0,
      sessions_count_current: 5,
      current_sessions: [
        {
          id: 11,
          day: "2025-07-17",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        },
        {
          id: 15,
          day: "2025-07-17",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        },
        {
          id: 116,
          day: "2025-07-23",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        },
        {
          id: 99,
          day: "2025-07-21",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        },
        {
          id: 111,
          day: "2025-07-20",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        }
      ],
      compelete_sessions: []
    },
    lessons: [
      {
        id: 6,
        day: "2025-07-17",
        start_time: "10:00",
        end_time: "11:00",
        coaching: 1,
        purpose: null,
        report_send: 0,
        status: "current",
        created_at: "2025-07-15",
        updated_at: "2025-07-15"
      },
      {
        id: 7,
        day: "2025-07-17",
        start_time: "17:00",
        end_time: "18:00",
        coaching: 1,
        purpose: null,
        report_send: 0,
        status: "current",
        created_at: "2025-07-15",
        updated_at: "2025-07-15"
      },
      {
        id: 10,
        day: "2025-07-23",
        start_time: "09:00:00",
        end_time: "10:00:00",
        coaching: 1,
        purpose: null,
        report_send: 0,
        status: "current",
        created_at: "2025-07-19",
        updated_at: "2025-07-19"
      },
      {
        id: 11,
        day: "2025-07-21",
        start_time: "11:00:00",
        end_time: "12:00:00",
        coaching: 1,
        purpose: null,
        report_send: 0,
        status: "current",
        created_at: "2025-07-19",
        updated_at: "2025-07-19"
      },
      {
        id: 12,
        day: "2025-07-20",
        start_time: "02:00:00",
        end_time: "03:00:00",
        coaching: 1,
        purpose: null,
        report_send: 0,
        status: "current",
        created_at: "2025-07-19",
        updated_at: "2025-07-19"
      }
    ]
  },
  {
    student: {
      id: 9,
      name: "Ahmed Student",
      email: "ahmed.student@gmail.com",
      phone: "01234567890",
      role: "student",
      provider_id: "",
      image: "https://picsum.photos/200/200",
      device_token: "",
      email_verified_at: "",
      location: "",
      join_at: "2025-05-30T18:24:23.000000Z",
      status: "active",
      review_lesson_price: 40,
      coaching_lesson_price: 35,
      debt: 150,
      assiend_teacher: null,
      sessions: 0,
      type: "regular",
      teacher: null,
      sessions_count: 3,
      sessions_count_done: 1,
      sessions_count_current: 2,
      current_sessions: [
        {
          id: 21,
          day: "2025-07-18",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        },
        {
          id: 22,
          day: "2025-07-19",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        }
      ],
      compelete_sessions: []
    },
    lessons: [
      {
        id: 21,
        day: "2025-07-18",
        start_time: "14:00",
        end_time: "15:00",
        coaching: 1,
        purpose: "Grammar review",
        report_send: 0,
        status: "current",
        created_at: "2025-07-15",
        updated_at: "2025-07-15"
      },
      {
        id: 22,
        day: "2025-07-19",
        start_time: "16:00",
        end_time: "17:00",
        coaching: 1,
        purpose: "Speaking practice",
        report_send: 0,
        status: "current",
        created_at: "2025-07-15",
        updated_at: "2025-07-15"
      }
    ]
  },
  {
    student: {
      id: 10,
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "09876543210",
      role: "student",
      provider_id: "",
      image: "https://picsum.photos/200/201",
      device_token: "",
      email_verified_at: "",
      location: "",
      join_at: "2025-05-29T18:24:23.000000Z",
      status: "active",
      review_lesson_price: 45,
      coaching_lesson_price: 40,
      debt: 200,
      assiend_teacher: null,
      sessions: 0,
      type: "premium",
      teacher: null,
      sessions_count: 4,
      sessions_count_done: 2,
      sessions_count_current: 2,
      current_sessions: [
        {
          id: 31,
          day: "2025-07-20",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        },
        {
          id: 32,
          day: "2025-07-21",
          start_date: null,
          end_date: null,
          status: null,
          coaching: null,
          purpose: null,
          report_send: null
        }
      ],
      compelete_sessions: []
    },
    lessons: [
      {
        id: 31,
        day: "2025-07-20",
        start_time: "10:00",
        end_time: "11:00",
        coaching: 1,
        purpose: "Vocabulary building",
        report_send: 0,
        status: "current",
        created_at: "2025-07-15",
        updated_at: "2025-07-15"
      },
      {
        id: 32,
        day: "2025-07-21",
        start_time: "15:00",
        end_time: "16:00",
        coaching: 1,
        purpose: "Reading comprehension",
        report_send: 0,
        status: "current",
        created_at: "2025-07-15",
        updated_at: "2025-07-15"
      }
    ]
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentName = searchParams.get("student_name");
    
    let filteredData = lessonsBoardData;
    
    // Filter by student name if provided
    if (studentName && studentName.trim()) {
      const searchTerm = studentName.toLowerCase().trim();
      filteredData = lessonsBoardData.filter(item => 
        item.student.name.toLowerCase().includes(searchTerm) ||
        item.student.email.toLowerCase().includes(searchTerm)
      );
    }
    
    return NextResponse.json({
      status: true,
      msg: "SUCCESS",
      data: filteredData
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lessons board data:", error);
    return NextResponse.json({
      status: false,
      msg: "Failed to fetch lessons board data",
      data: []
    }, { status: 500 });
  }
} 
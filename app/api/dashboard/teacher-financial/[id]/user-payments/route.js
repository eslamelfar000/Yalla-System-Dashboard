import { NextResponse } from "next/server";

// Mock data for teacher financial payments
const teacherFinancialData = [
  {
    "id": 6,
    "day": "2025-07-17",
    "student": {
      "id": 8,
      "name": "Eslam-quality",
      "email": "eslamsaber708@gmail.com",
      "phone": "01164376176",
      "role": "quality",
      "provider_id": "",
      "image": "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
      "device_token": "",
      "email_verified_at": "",
      "location": "",
      "join_at": "2025-05-31T18:24:23.000000Z",
      "status": "active",
      "review_lesson_price": 60,
      "coaching_lesson_price": 50,
      "debt": 300,
      "assiend_teacher": null,
      "sessions": 0,
      "type": "premium",
      "teacher": null,
      "sessions_count": 5,
      "sessions_count_done": 0,
      "sessions_count_current": 5,
      "current_sessions": [
        {
          "id": 11,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 15,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 116,
          "day": "2025-07-23",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 99,
          "day": "2025-07-21",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 111,
          "day": "2025-07-20",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        }
      ],
      "compelete_sessions": []
    },
    "start_time": "10:00",
    "end_time": "11:00",
    "status": "current",
    "coaching": 1,
    "purpose": null,
    "report_send": 0,
    "created_at": "2025-07-15",
    "updated_at": "2025-07-15",
    "payment": null
  },
  {
    "id": 7,
    "day": "2025-07-17",
    "student": {
      "id": 8,
      "name": "Eslam-quality",
      "email": "eslamsaber708@gmail.com",
      "phone": "01164376176",
      "role": "quality",
      "provider_id": "",
      "image": "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
      "device_token": "",
      "email_verified_at": "",
      "location": "",
      "join_at": "2025-05-31T18:24:23.000000Z",
      "status": "active",
      "review_lesson_price": 60,
      "coaching_lesson_price": 50,
      "debt": 300,
      "assiend_teacher": null,
      "sessions": 0,
      "type": "premium",
      "teacher": null,
      "sessions_count": 5,
      "sessions_count_done": 0,
      "sessions_count_current": 5,
      "current_sessions": [
        {
          "id": 11,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 15,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 116,
          "day": "2025-07-23",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 99,
          "day": "2025-07-21",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 111,
          "day": "2025-07-20",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        }
      ],
      "compelete_sessions": []
    },
    "start_time": "17:00",
    "end_time": "18:00",
    "status": "current",
    "coaching": 1,
    "purpose": null,
    "report_send": 0,
    "created_at": "2025-07-15",
    "updated_at": "2025-07-15",
    "payment": {
      "id": 2,
      "type": "deduction",
      "amount": "25.00",
      "note": "Late cancellation fee",
      "created_at": "2025-07-17"
    }
  },
  {
    "id": 10,
    "day": "2025-07-23",
    "student": {
      "id": 8,
      "name": "Eslam-quality",
      "email": "eslamsaber708@gmail.com",
      "phone": "01164376176",
      "role": "quality",
      "provider_id": "",
      "image": "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
      "device_token": "",
      "email_verified_at": "",
      "location": "",
      "join_at": "2025-05-31T18:24:23.000000Z",
      "status": "active",
      "review_lesson_price": 60,
      "coaching_lesson_price": 50,
      "debt": 300,
      "assiend_teacher": null,
      "sessions": 0,
      "type": "premium",
      "teacher": null,
      "sessions_count": 5,
      "sessions_count_done": 0,
      "sessions_count_current": 5,
      "current_sessions": [
        {
          "id": 11,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 15,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 116,
          "day": "2025-07-23",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 99,
          "day": "2025-07-21",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 111,
          "day": "2025-07-20",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        }
      ],
      "compelete_sessions": []
    },
    "start_time": "09:00:00",
    "end_time": "10:00:00",
    "status": "current",
    "coaching": 1,
    "purpose": null,
    "report_send": 0,
    "created_at": "2025-07-19",
    "updated_at": "2025-07-19",
    "payment": null
  },
  {
    "id": 11,
    "day": "2025-07-21",
    "student": {
      "id": 8,
      "name": "Eslam-quality",
      "email": "eslamsaber708@gmail.com",
      "phone": "01164376176",
      "role": "quality",
      "provider_id": "",
      "image": "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
      "device_token": "",
      "email_verified_at": "",
      "location": "",
      "join_at": "2025-05-31T18:24:23.000000Z",
      "status": "active",
      "review_lesson_price": 60,
      "coaching_lesson_price": 50,
      "debt": 300,
      "assiend_teacher": null,
      "sessions": 0,
      "type": "premium",
      "teacher": null,
      "sessions_count": 5,
      "sessions_count_done": 0,
      "sessions_count_current": 5,
      "current_sessions": [
        {
          "id": 11,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 15,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 116,
          "day": "2025-07-23",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 99,
          "day": "2025-07-21",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 111,
          "day": "2025-07-20",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        }
      ],
      "compelete_sessions": []
    },
    "start_time": "11:00:00",
    "end_time": "12:00:00",
    "status": "current",
    "coaching": 1,
    "purpose": null,
    "report_send": 0,
    "created_at": "2025-07-19",
    "updated_at": "2025-07-19",
    "payment": null
  },
  {
    "id": 12,
    "day": "2025-07-20",
    "student": {
      "id": 8,
      "name": "Eslam-quality",
      "email": "eslamsaber708@gmail.com",
      "phone": "01164376176",
      "role": "quality",
      "provider_id": "",
      "image": "https://indigo-ferret-819035.hostingersite.com/storage/files/6849db6bab098_1749670763.jpg",
      "device_token": "",
      "email_verified_at": "",
      "location": "",
      "join_at": "2025-05-31T18:24:23.000000Z",
      "status": "active",
      "review_lesson_price": 60,
      "coaching_lesson_price": 50,
      "debt": 300,
      "assiend_teacher": null,
      "sessions": 0,
      "type": "premium",
      "teacher": null,
      "sessions_count": 5,
      "sessions_count_done": 0,
      "sessions_count_current": 5,
      "current_sessions": [
        {
          "id": 11,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 15,
          "day": "2025-07-17",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 116,
          "day": "2025-07-23",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 99,
          "day": "2025-07-21",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        },
        {
          "id": 111,
          "day": "2025-07-20",
          "start_date": null,
          "end_date": null,
          "status": null,
          "coaching": null,
          "purpose": null,
          "report_send": null
        }
      ],
      "compelete_sessions": []
    },
    "start_time": "02:00:00",
    "end_time": "03:00:00",
    "status": "current",
    "coaching": 1,
    "purpose": null,
    "report_send": 0,
    "created_at": "2025-07-19",
    "updated_at": "2025-07-19",
    "payment": {
      "id": 1,
      "type": "raise",
      "amount": "100.00",
      "note": "Excellent performance bonus",
      "created_at": "2025-07-21"
    }
  }
];

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      status: true,
      msg: "SUCCESS",
      data: teacherFinancialData
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching teacher financial data:", error);
    return NextResponse.json({
      status: false,
      msg: "Failed to fetch teacher financial data",
      data: []
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['teacher_id', 'schedual_lession_id', 'type', 'amount'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        status: false,
        msg: "Validation failed",
        errors: {
          teacher_id: missingFields.includes('teacher_id') ? ["The teacher id field is required."] : [],
          schedual_lession_id: missingFields.includes('schedual_lession_id') ? ["The schedual lession id field is required."] : [],
          type: missingFields.includes('type') ? ["The type field is required."] : [],
          amount: missingFields.includes('amount') ? ["The amount field is required."] : [],
        }
      }, { status: 422 });
    }
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful response
    return NextResponse.json({
      status: true,
      msg: "Salary adjustment added successfully",
      data: {
        id: Date.now(),
        teacher_id: body.teacher_id,
        schedual_lession_id: body.schedual_lession_id,
        type: body.type,
        amount: body.amount,
        note: body.note,
        created_at: new Date().toISOString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error adding salary adjustment:", error);
    return NextResponse.json({
      status: false,
      msg: "Failed to add salary adjustment",
      data: null
    }, { status: 500 });
  }
} 
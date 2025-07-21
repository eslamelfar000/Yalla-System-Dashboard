import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['student_id', 'completed_at'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        status: false,
        msg: "Validation failed",
        errors: {
          student_id: missingFields.includes('student_id') ? ["The student id field is required."] : [],
          completed_at: missingFields.includes('completed_at') ? ["The completed at field is required."] : [],
        }
      }, { status: 422 });
    }
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful response
    return NextResponse.json({
      status: true,
      msg: "Session completed successfully",
      data: {
        id: Date.now(),
        student_id: body.student_id,
        completed_at: body.completed_at,
        lessons_completed: Math.floor(Math.random() * 5) + 1, // Random number of lessons completed
        created_at: new Date().toISOString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error completing session:", error);
    return NextResponse.json({
      status: false,
      msg: "Failed to complete session",
      data: null
    }, { status: 500 });
  }
} 
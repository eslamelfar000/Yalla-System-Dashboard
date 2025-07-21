import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    return NextResponse.json({
      status: true,
      msg: "Session completed successfully",
      data: {
        lesson_id: body.lesson_id,
        completed_at: body.completed_at,
        status: "done"
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error completing session:", error);
    return NextResponse.json({
      status: false,
      msg: "Failed to complete session",
      data: null
    }, { status: 500 });
  }
} 
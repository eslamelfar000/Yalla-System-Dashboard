import { NextResponse } from "next/server";
import { profileUser } from "../../chat/data";

export async function GET(request, response) {
  return NextResponse.json({
    data: profileUser,
    success: true,
    message: "Profile fetched successfully"
  }, { status: 200 });
} 
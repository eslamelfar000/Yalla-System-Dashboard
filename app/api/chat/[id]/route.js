import { NextResponse } from "next/server";
import { contacts } from "../data";

export async function GET(request, response) {
  const id = response.params.id;

  if (!id) {
    return NextResponse.json(
      { 
        data: {}, 
        success: false, 
        message: "Chat ID is required" 
      }, 
      { status: 400 }
    );
  }

  // Find the contact with the given ID
  const contact = contacts.find((item) => item.id === parseInt(id));

  if (!contact) {
    return NextResponse.json(
      { 
        data: {}, 
        success: false, 
        message: "Chat not found" 
      }, 
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: contact,
    success: true,
    message: "Chat info fetched successfully"
  }, { status: 200 });
} 
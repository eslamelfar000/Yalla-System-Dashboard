import { NextResponse } from "next/server";
import { chats } from "../data";

export async function GET(request, response) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chat_id');
  const page = parseInt(searchParams.get('page')) || 1;
  const pageSize = 20; // Number of messages per page

  if (!chatId) {
    return NextResponse.json(
      { 
        data: [], 
        success: false, 
        message: "chat_id is required" 
      }, 
      { status: 400 }
    );
  }

  const chat = chats.find((item) => item.id === parseInt(chatId));
  
  if (!chat) {
    return NextResponse.json(
      { 
        data: [], 
        success: false, 
        message: "Chat not found" 
      }, 
      { status: 404 }
    );
  }

  // Paginate the messages
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const messages = chat.chat.slice(startIndex, endIndex);

  return NextResponse.json({
    data: messages,
    success: true,
    message: "Messages fetched successfully",
    pagination: {
      page,
      pageSize,
      total: chat.chat.length,
      hasMore: endIndex < chat.chat.length
    }
  }, { status: 200 });
}

export async function POST(request, response) {
  const obj = await request.json();

  // Handle both old and new data structures
  const chatId = obj.chat_id || obj.contact?.id;
  const message = obj.message;
  const time = obj.time || new Date().toISOString();
  const replayMetadata = obj.replayMetadata || false;

  if (!chatId || !message) {
    return NextResponse.json(
      { 
        success: false, 
        message: "chat_id and message are required" 
      }, 
      { status: 400 }
    );
  }

  let activeChat = chats.find((item) => item.id === parseInt(chatId));

  const newMessageData = {
    message: message,
    time: time,
    senderId: 11,
    replayMetadata: replayMetadata,
  };

  if (!activeChat) {
    activeChat = {
      id: parseInt(chatId),
      userId: parseInt(chatId),
      unseenMsgs: 0,
      chat: [newMessageData],
    };
    chats.push(activeChat);
  } else {
    activeChat.chat.push(newMessageData);
  }

  return NextResponse.json(
    {
      data: newMessageData,
      success: true,
      message: "Message sent successfully"
    },
    { status: 201 }
  );
}

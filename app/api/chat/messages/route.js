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
  try {
    let chatId, message, time, replayMetadata, attachments = [];

    // Check if the request is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload with FormData
      const formData = await request.formData();
      
      chatId = formData.get('chat_id');
      message = formData.get('message') || '';
      time = formData.get('time') || new Date().toISOString();
      replayMetadata = JSON.parse(formData.get('replayMetadata') || 'false');
      
      // Process attachments
      const attachmentIndices = new Set();
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('attachments[') && key.includes('][type]')) {
          const index = key.match(/attachments\[(\d+)\]/)?.[1];
          if (index) attachmentIndices.add(index);
        }
      }
      
      for (const index of attachmentIndices) {
        const type = formData.get(`attachments[${index}][type]`);
        const name = formData.get(`attachments[${index}][name]`);
        const size = formData.get(`attachments[${index}][size]`);
        const url = formData.get(`attachments[${index}][url]`);
        const file = formData.get(`attachments[${index}][file]`);
        
        const attachment = {
          type,
          name,
          size: size ? parseInt(size) : null,
          url: url || null,
          file: file || null,
        };
        
        attachments.push(attachment);
      }
    } else {
      // Handle regular JSON request
      const obj = await request.json();
      
      chatId = obj.chat_id || obj.contact?.id;
      message = obj.message;
      time = obj.time || new Date().toISOString();
      replayMetadata = obj.replayMetadata || false;
      attachments = obj.attachments || [];
    }

    if (!chatId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "chat_id is required" 
        }, 
        { status: 400 }
      );
    }

    let activeChat = chats.find((item) => item.id === parseInt(chatId));

    const newMessageData = {
      id: Date.now(),
      message: message,
      time: time,
      senderId: 11,
      replayMetadata: replayMetadata,
      attachments: attachments,
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
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message"
      },
      { status: 500 }
    );
  }
}

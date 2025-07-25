import { NextResponse } from "next/server";

import { profileUser, contacts, chats } from "./data";

export async function GET(request, response) {
  const contactsData = contacts; // Assuming this fetches all contacts data

  const chatsContacts = contactsData.map((contact) => {
    const chat = chats.find((chat) => chat.userId === contact.id);
    const lastMessage = chat ? chat.chat[chat.chat.length - 1] : null;
    const lastMessageTime = lastMessage ? lastMessage.time : null;

    return {
      ...contact,
      chat: {
        id: chat ? chat.id : null,
        unseenMsgs: chat ? chat.unseenMsgs : null,
        lastMessage: lastMessage ? lastMessage.message : null,
        lastMessageTime: lastMessageTime
          ? new Date(lastMessageTime).toISOString()
          : null,
      },
    };
  });

  return NextResponse.json({ 
    data: chatsContacts, 
    success: true, 
    message: "Chats fetched successfully" 
  }, { status: 200 });
}

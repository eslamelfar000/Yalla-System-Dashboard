"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime } from "@/lib/utils";
import { Icon } from "@iconify/react";

const ContactList = ({ contact, openChat, selectedChatId }) => {
  // Handle different data structures from API
  const {
    id,
    chat_id,
    user_id,
    name,
    fullName,
    avatar,
    image,
    status = "offline",
    about,
    bio,
    last_message,
    lastMessage,
    unread_count,
    unreadmessage,
    updated_at,
    created_at,
    date,
  } = contact;

  // Use the appropriate fields based on what's available
  const chatId = id || chat_id;
  const userName = name || fullName;
  const userAvatar = avatar?.src || image || avatar;
  const userAbout = about || bio;
  const lastMsg = last_message || lastMessage;
  const unreadCount = unread_count || unreadmessage || 0;
  const lastDate = updated_at || created_at || date;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 border-l-2 border-transparent hover:bg-muted/50 cursor-pointer transition-colors",
        {
          "border-primary bg-muted/50": chatId === selectedChatId,
        }
      )}
      onClick={() => openChat(chatId)}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="uppercase text-xs">
            {userName?.slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <Badge
          className={cn(
            "h-2 w-2 p-0 absolute -bottom-0.5 -right-0.5 ring-2 ring-background",
            {
              "bg-green-500": status === "online",
              "bg-gray-400": status !== "online",
            }
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground truncate">
            {userName || "Unknown User"}
          </span>
          {lastDate && (
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {formatTime(lastDate)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground truncate">
            {lastMsg || userAbout || "No messages yet"}
          </span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="h-5 w-5 p-0 text-xs flex items-center justify-center ml-2 flex-shrink-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;

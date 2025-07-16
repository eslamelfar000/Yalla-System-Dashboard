"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime, safeToString } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import { Skeleton } from "@/components/ui/skeleton";

// Utility function to safely get last message content
const getSafeLastMessage = (lastMessage) => {
  if (!lastMessage) return "";

  // If lastMessage is an object, try to extract the message property
  if (typeof lastMessage === "object") {
    if (lastMessage.message) return safeToString(lastMessage.message);
    if (lastMessage.text) return safeToString(lastMessage.text);
    if (lastMessage.content) return safeToString(lastMessage.content);
    return safeToString(lastMessage);
  }

  return safeToString(lastMessage);
};

// Skeleton component for chat list items
const ContactListSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="relative">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full absolute -bottom-0.5 -right-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
};

const ContactList = ({
  contact,
  openChat,
  selectedChatId,
  isLoading = false,
}) => {
  // Show skeleton if loading
  if (isLoading) {
    return <ContactListSkeleton />;
  }

  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== "object") {
    console.warn("Invalid contact object:", contact);
    return null;
  }

  // Handle different data structures from API
  const {
    id,
    chat_id,
    name,
    fullName,
    role,
    avatar,
    image,
    status = "offline",
    about,
    bio,
    last_message,
    lastMessage,
    unread_count,
    unreadmessage,
    unseenMsgs,
    updated_at,
    created_at,
    date,
  } = contact;

  // Use the appropriate fields based on what's available
  const chatId = id || chat_id;
  const userName = safeToString(name || fullName || role || "Unknown User");
  const userAvatar = fixImageUrl(avatar?.src || image || avatar);
  const userAbout = safeToString(about || bio);
  const lastMsg = getSafeLastMessage(last_message || lastMessage);
  const unreadCount = unread_count || unreadmessage || unseenMsgs || 0;
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
          <AvatarFallback className="uppercase text-xs bg-primary/50">
            {getAvatarInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <Badge
          className={cn(
            "h-2 w-2 p-0 absolute bottom-0 right-0 ring-2 ring-background",
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
            {userName}
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

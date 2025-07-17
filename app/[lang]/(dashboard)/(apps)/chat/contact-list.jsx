"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime, safeToString } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();
  const userRole = user?.role || null;

  // Show skeleton if loading
  if (isLoading) {
    return <ContactListSkeleton />;
  }

  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== "object") {
    console.warn("Invalid contact object:", contact);
    return null;
  }

  // Handle different data structures based on user role
  let chatId,
    userName,
    userAvatar,
    userAbout,
    lastMsg,
    unreadCount,
    lastDate,
    status;

  if (userRole === "admin") {
    // Admin data structure - has both student and teacher info
    const {
      id,
      student_name,
      teacher_name,
      student_image,
      teacher_image,
      last_message,
      last_message_time,
      unread_count,
      status: chatStatus,
      created_at,
      updated_at,
    } = contact;

    chatId = id;
    userName = `${safeToString(student_name)} ↔ ${safeToString(teacher_name)}`;
    userAvatar = fixImageUrl(student_image || teacher_image);
    userAbout = `Student: ${safeToString(
      student_name
    )} | Teacher: ${safeToString(teacher_name)}`;
    lastMsg = getSafeLastMessage(last_message);
    unreadCount = unread_count || 0;
    lastDate = last_message_time || updated_at || created_at;
    status = chatStatus || "offline";
  } else {
    // Teacher data structure - single user info
    const {
      id,
      chat_id,
      name,
      fullName,
      role,
      avatar,
      image,
      status: userStatus = "offline",
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

    chatId = id || chat_id;
    userName = safeToString(name || fullName || role || "Unknown User");
    userAvatar = fixImageUrl(avatar?.src || image || avatar);
    userAbout = safeToString(about || bio);
    lastMsg = getSafeLastMessage(last_message || lastMessage);
    unreadCount = unread_count || unreadmessage || unseenMsgs || 0;
    lastDate = updated_at || created_at || date;
    status = userStatus;
  }

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

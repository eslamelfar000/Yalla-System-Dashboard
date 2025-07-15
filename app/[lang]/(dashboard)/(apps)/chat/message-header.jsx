"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, safeToString } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";

const MessageHeader = ({ contact, showInfo, handleShowInfo }) => {
  const isLg = useMediaQuery("(max-width: 1024px)");

  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== "object") {
    console.warn("Invalid contact object in MessageHeader:", contact);
    return null;
  }

  // Handle different data structures from API
  const {
    id,
    chat_id,
    user_id,
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
  const userAbout = safeToString(about || bio || "No status");
  const lastMsg = safeToString(last_message || lastMessage);
  const unreadCount = unread_count || unreadmessage || unseenMsgs || 0;
  const lastDate = updated_at || created_at || date;

  const isActive = status === "online";

  return (
    <div className="flex items-center p-4 border-b border-default-200">
      <div className="flex flex-1 gap-3 items-center">
        {isLg && (
          <Menu
            className=" h-5 w-5 cursor-pointer text-default-600"
            onClick={() => {}} // Mobile menu handler
          />
        )}
        <div className="relative inline-block">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="uppercase">
              {getAvatarInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <Badge
            className=" h-3 w-3  p-0 ring-1 ring-border ring-offset-[1px]   items-center justify-center absolute left-[calc(100%-12px)] top-[calc(100%-12px)]"
            color={isActive ? "success" : "secondary"}
          ></Badge>
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-default-900 ">
            <span className="relative">{userName}</span>
          </div>
          <span className="text-xs text-default-500">
            {isActive ? "Active Now" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex-none space-x-2 rtl:space-x-reverse">
        {/* Contact Info */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn(
                  "bg-transparent hover:bg-default-50 rounded-full",
                  {
                    "text-primary": !showInfo,
                  }
                )}
                onClick={handleShowInfo}
              >
                <span className="text-xl text-primary ">
                  {showInfo ? (
                    <Icon icon="material-symbols:info" />
                  ) : (
                    <Icon icon="material-symbols:info-outline" />
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Conversation information</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MessageHeader;

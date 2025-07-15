"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const MessageHeader = ({
  contact,
  showInfo,
  handleShowInfo,
  handleSetIsOpenSearch,
  isOpenSearch,
  handlePinMessage,
  handleForward,
  isForward,
}) => {
  const isLg = useMediaQuery("(max-width: 1024px)");

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
  const userName = name || fullName || "Unknown User";
  const userAvatar = avatar?.src || image || avatar;
  const userAbout = about || bio || "No status";
  const lastMsg = last_message || lastMessage;
  const unreadCount = unread_count || unreadmessage || 0;
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
              {userName?.slice(0, 2) || "U"}
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
        {/* Search Messages */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn(
                  "bg-transparent hover:bg-default-50 rounded-full",
                  {
                    "text-primary": !isOpenSearch,
                  }
                )}
                onClick={handleSetIsOpenSearch}
              >
                <span className="text-xl text-primary ">
                  <Icon icon="heroicons:magnifying-glass" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Search messages</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Pin Messages */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="bg-transparent hover:bg-default-50 rounded-full"
                onClick={handlePinMessage}
              >
                <span className="text-xl text-primary ">
                  <Icon icon="ion:pin-sharp" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Pin messages</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Forward Messages */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn(
                  "bg-transparent hover:bg-default-50 rounded-full",
                  {
                    "text-primary": !isForward,
                  }
                )}
                onClick={handleForward}
              >
                <span className="text-xl text-primary ">
                  <Icon icon="material-symbols:forward" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Forward messages</p>
              <TooltipArrow className="fill-primary" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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

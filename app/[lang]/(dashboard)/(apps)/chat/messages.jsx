import React, { useState, useEffect } from "react";
import { formatTime } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Undo2 } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

const Messages = ({
  messages,
  selectedChatId,
  onDelete,
  handleReply,
  pinnedMessages,
  handleUnpinMessage,
  chatHeightRef,
}) => {
  const { user } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatHeightRef?.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, chatHeightRef]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-default-600">
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full py-4 overflow-y-auto no-scrollbar"
      ref={chatHeightRef}
    >
      {messages.map((message, index) => (
        <MessageItem
          key={message.id || index}
          message={message}
          index={index}
          selectedChatId={selectedChatId}
          onDelete={onDelete}
          handleReply={handleReply}
          pinnedMessages={pinnedMessages}
          handleUnpinMessage={handleUnpinMessage}
          currentUserId={user?.id}
        />
      ))}
    </div>
  );
};

const MessageItem = ({
  message,
  index,
  selectedChatId,
  onDelete,
  handleReply,
  pinnedMessages,
  handleUnpinMessage,
  currentUserId,
}) => {
  const {
    id,
    message: chatMessage,
    sender_id,
    user_id,
    created_at,
    updated_at,
    time,
    sender,
    user,
  } = message;

  // Determine if message is from current user
  const isOwnMessage = sender_id === currentUserId || user_id === currentUserId;
  const messageTime = time || created_at || updated_at;
  const senderName = sender?.name || user?.name || "Unknown";
  const senderAvatar =
    sender?.avatar || user?.avatar || sender?.image || user?.image;

  // Check if message is pinned
  const isMessagePinned = pinnedMessages.some(
    (pinnedMessage) => pinnedMessage.id === id
  );

  const handlePinMessageLocal = (messageData) => {
    const obj = {
      id: id,
      note: messageData,
      avatar: senderAvatar,
      senderName: senderName,
    };
    handleUnpinMessage(obj);
  };

  return (
    <div className="block md:px-6 px-0">
      {isOwnMessage ? (
        <>
          <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse mb-4">
            <div className=" flex flex-col  gap-1">
              <div className="flex items-center gap-1">
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span className="w-7 h-7 rounded-full bg-default-200 flex items-center justify-center">
                        <Icon
                          icon="bi:three-dots-vertical"
                          className="text-lg"
                        />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-20 p-0"
                      align="center"
                      side="top"
                    >
                      <DropdownMenuItem onClick={() => onDelete(id)}>
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem>Forward</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="whitespace-pre-wrap break-all">
                  <div className="bg-primary/70 text-primary-foreground  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                    {chatMessage}
                  </div>
                </div>
              </div>
              <span className="text-xs text-end text-default-500">
                {formatTime(messageTime)}
              </span>
            </div>
            <div className="flex-none self-end -translate-y-5">
              <Avatar className="h-8 w-8">
                <AvatarImage src={senderAvatar} />
                <AvatarFallback className="text-xs">
                  {senderName?.slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </>
      ) : (
        <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
          <div className="flex-none self-end -translate-y-5">
            <Avatar className="h-8 w-8">
              <AvatarImage src={senderAvatar} />
              <AvatarFallback className="text-xs">
                {senderName?.slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col   gap-1">
              <div className="flex items-center gap-1">
                <div className="whitespace-pre-wrap break-all relative z-[1]">
                  {isMessagePinned && (
                    <Icon
                      icon="ion:pin-sharp"
                      className=" w-5 h-5 text-destructive  absolute left-0 -top-3 z-[-1]  transform -rotate-[30deg]"
                    />
                  )}

                  <div className="bg-default-200  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                    {chatMessage}
                  </div>
                </div>
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span className="w-7 h-7 rounded-full bg-default-200 flex items-center justify-center">
                        <Icon
                          icon="bi:three-dots-vertical"
                          className="text-lg"
                        />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-20 p-0"
                      align="center"
                      side="top"
                    >
                      <DropdownMenuItem onClick={() => onDelete(id)}>
                        Remove
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleReply(chatMessage, {
                            name: senderName,
                            avatar: senderAvatar,
                          })
                        }
                      >
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePinMessageLocal(chatMessage)}
                      >
                        {isMessagePinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Forward</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <span className="text-xs   text-default-500">
                {formatTime(messageTime)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

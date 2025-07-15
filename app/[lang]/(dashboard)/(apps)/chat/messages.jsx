"use client";
import React, { useState, useEffect } from "react";
import { formatTime, safeToString } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Undo2 } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";

// Utility function to safely get message content
const getSafeMessageContent = (message) => {
  if (!message) return "";

  // If message is an object, try to extract the message property
  if (typeof message === "object") {
    if (message.message) return safeToString(message.message);
    if (message.text) return safeToString(message.text);
    if (message.content) return safeToString(message.content);
    return safeToString(message);
  }

  return safeToString(message);
};

const Messages = ({
  messages,
  selectedChatId,
  onDelete,
  handleReply,
  chatHeightRef,
}) => {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatHeightRef?.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, chatHeightRef]);

  // Debug: Log messages to see their structure
  console.log("Messages data:", messages);

  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      onDelete(messageToDelete);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

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
    <>
      <div
        className="h-full py-4 overflow-y-auto no-scrollbar"
        ref={chatHeightRef}
      >
        {messages
          .sort((a, b) => {
            // Sort by time, ensuring oldest messages appear first (top)
            const timeA = a.time || a.created_at || a.updated_at;
            const timeB = b.time || b.created_at || b.updated_at;
            return new Date(timeA) - new Date(timeB);
          })
          .map((message, index) => {
            // Safety check: ensure message is a valid object
            if (!message || typeof message !== "object") {
              console.warn("Invalid message object:", message);
              return null;
            }

            return (
              <MessageItem
                key={message.id || index}
                message={message}
                index={index}
                selectedChatId={selectedChatId}
                onDelete={handleDeleteClick}
                handleReply={handleReply}
                currentUserId={user?.id}
              />
            );
          })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const MessageItem = ({
  message,
  index,
  selectedChatId,
  onDelete,
  handleReply,
  currentUserId,
}) => {
  // Safety check: ensure message has required properties
  if (!message || typeof message !== "object") {
    console.warn("Invalid message in MessageItem:", message);
    return null;
  }

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
  const senderName = safeToString(sender?.name || user?.name || "Unknown");
  const senderAvatar = fixImageUrl(
    sender?.avatar || user?.avatar || sender?.image || user?.image
  );

  // Get safe message content
  const safeMessageContent = getSafeMessageContent(chatMessage);

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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="whitespace-pre-wrap break-all">
                  <div className="bg-primary text-primary-foreground  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                    {safeMessageContent}
                  </div>
                </div>
              </div>
              <span className="text-xs text-end text-default-500">
                {formatTime(messageTime)}
              </span>
            </div>
            <div className="flex-none self-end -translate-y-5">
              <Avatar className="h-10 w-10">
                <AvatarImage src={senderAvatar} />
                <AvatarFallback className="text-xs">
                  {getAvatarInitials(senderName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </>
      ) : (
        <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
          <div className="flex-none self-end -translate-y-5">
            <Avatar className="h-10 w-10">
              <AvatarImage src={senderAvatar} />
              <AvatarFallback className="text-xs">
                {getAvatarInitials(senderName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <div className="whitespace-pre-wrap break-all relative z-[1]">
                <div className="bg-default-200  text-sm  py-2 px-3 rounded-2xl  flex-1  ">
                  {safeMessageContent}
                </div>
              </div>
            </div>
            <span className="text-xs   text-default-500">
              {formatTime(messageTime)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

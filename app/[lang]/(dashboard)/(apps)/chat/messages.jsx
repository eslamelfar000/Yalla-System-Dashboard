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
import { Undo2, Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";

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

// Utility function to detect and render URLs in text
const renderTextWithLinks = (text) => {
  if (!text) return text;

  // URL regex pattern to detect various URL formats
  const urlRegex =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.(com|org|net|edu|gov|mil|io|co|me|tv|info|biz|us|uk|ca|au|de|fr|jp|cn|in|br|ru|mx|es|it|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|mt|cy|gr|pt|ie|lu|at|be|ch|li|mc|ad|sm|va|it|va|sm|ad|mc|li|ch|be|at|lu|ie|pt|gr|cy|mt|ee|lv|lt|sk|si|hr|bg|ro|hu|cz|pl|fi|dk|no|se|nl|it|es|mx|ru|br|in|cn|jp|de|au|ca|uk|us|biz|info|tv|me|co|io|mil|gov|edu|net|org|com))/gi;

  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Ensure URL has protocol
      let url = part;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all"
          onClick={(e) => {
            e.stopPropagation();
            window.open(url, "_blank");
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Component to render attachments
const AttachmentRenderer = ({ attachments, userRole }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      {attachments.map((attachment, index) => {
        // Safety check for attachment structure
        if (!attachment) {
          console.warn("Invalid attachment:", attachment);
          return null;
        }

        const attachmentId = attachment.id || index;
        const attachmentType = attachment.type || attachment.attach_type;
        const attachmentName =
          attachment.name || attachment.attach_name || "Unknown file";
        const attachmentLink = attachment.link || attachment.uploaded_file;
        const attachmentSize = attachment.size || attachment.attach_size;

        // Handle different size formats
        let displaySize = "";
        if (attachmentSize) {
          if (typeof attachmentSize === "number") {
            displaySize = formatFileSize(attachmentSize);
          } else if (typeof attachmentSize === "string") {
            displaySize = attachmentSize;
          }
        }

        return (
          <div key={attachmentId} className="max-w-xs">
            {/* Image Attachments */}
            {attachmentType.includes("image") && attachmentLink && (
              <div className="relative group">
                <Image
                  src={attachmentLink}
                  alt={attachmentName}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity w-full h-full"
                  onClick={() => window.open(attachmentLink, "_blank")}
                  onError={(e) => {
                    console.warn("Failed to load image:", attachmentLink);
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(attachmentLink, "_blank")}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* File Attachments */}
            {!attachmentType.includes("image") && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border">
                <Icon
                  icon="tabler:file-filled"
                  className="w-5 h-5 text-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachmentName}
                  </p>
                  {displaySize && (
                    <p className="text-xs text-muted-foreground">
                      {displaySize}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    if (attachmentLink) {
                      window.open(attachmentLink, "_blank");
                    }
                  }}
                  disabled={!attachmentLink}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Messages = ({
  messages,
  selectedChatId,
  onDelete,
  handleReply,
  chatHeightRef,
  chatInfo,
}) => {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  console.log(messages);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatHeightRef?.current) {
      chatHeightRef.current.scrollTo({
        top: chatHeightRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, chatHeightRef]);

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
        className="h-full py-4 overflow-y-auto no-scrollbar min-h-0"
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
                userRole={user?.role}
                chatInfo={chatInfo}
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
            <AlertDialogAction onClick={handleConfirmDelete}>
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
  onDelete,
  currentUserId,
  userRole,
  chatInfo,
}) => {
  // Handle different message data structures based on user role
  let senderId,
    senderName,
    senderAvatar,
    messageTime,
    chatMessage,
    attachments,
    senderRole;

  if (userRole === "admin") {
    // Admin message structure - user info is not nested in message, need to get from participants
    const {
      id,
      message: msgContent,
      user_id,
      created_at,
      updated_at,
      attachments: msgAttachments,
    } = message;

    senderId = user_id;
    messageTime = created_at || updated_at;
    chatMessage = msgContent;
    attachments = msgAttachments;

    // Get user info from participants array in chatInfo
    let userInfo = null;
    if (chatInfo && chatInfo.participants) {
      userInfo = chatInfo.participants.find((p) => p.user_id === user_id)?.user;
    }

    senderName = safeToString(userInfo?.name || "Unknown");
    senderAvatar = fixImageUrl(userInfo?.image);
    senderRole = userInfo?.role; // Get the role (student/teacher)
  } else {
    // Teacher message structure
    const {
      id,
      message: msgContent,
      sender_id,
      user_id,
      created_at,
      updated_at,
      time,
      sender,
      user,
      attachments: msgAttachments,
    } = message;

    senderId = sender_id || user_id;
    senderName = safeToString(sender?.name || user?.name || "Unknown");
    senderAvatar = fixImageUrl(
      sender?.avatar || user?.avatar || sender?.image || user?.image
    );
    messageTime = time || created_at || updated_at;
    chatMessage = msgContent;
    attachments = msgAttachments;
    senderRole = sender?.role || user?.role;
  }

  // For admin view: determine message alignment based on sender role
  // Student messages on left, Teacher messages on right
  let isOwnMessage = false;

  if (userRole === "admin") {
    // In admin view, we want teacher messages on the right, student messages on the left
    isOwnMessage = senderRole === "teacher";
  } else {
    // For teacher view, use the normal logic based on current user ID
    isOwnMessage = senderId === currentUserId;
  }

  // Get safe message content
  const safeMessageContent = getSafeMessageContent(chatMessage);

  return (
    <div className="block md:px-6 px-0">
      {isOwnMessage ? (
        <>
          <div className="flex space-x-2 items-end justify-end group w-full rtl:space-x-reverse mb-4">
            <div className="flex flex-col items-end gap-1">
              {userRole === "admin" && (
                <span className="text-xs text-default-500">{senderName}</span>
              )}
              <div className="flex items-center gap-1">
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  {userRole === "teacher" && (
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
                        <DropdownMenuItem onClick={() => onDelete(message.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="whitespace-pre-wrap break-all">
                  <div className="bg-primary text-primary-foreground text-sm py-2 px-3 rounded-2xl flex-1">
                    {renderTextWithLinks(safeMessageContent)}
                  </div>
                  {/* Render attachments */}
                  <AttachmentRenderer
                    attachments={attachments}
                    userRole={userRole}
                  />
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
            {userRole === "admin" && (
              <span className="text-xs text-default-500">{senderName}</span>
            )}
            <div className="flex items-center gap-1">
              <div className="whitespace-pre-wrap break-all relative z-[1]">
                <div className="bg-default-200 text-sm py-2 px-3 rounded-2xl flex-1">
                  {renderTextWithLinks(safeMessageContent)}
                </div>
                {/* Render attachments */}
                <AttachmentRenderer
                  attachments={attachments}
                  userRole={userRole}
                />
              </div>
            </div>
            <span className="text-xs text-default-500">
              {formatTime(messageTime)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

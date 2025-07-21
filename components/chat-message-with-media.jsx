"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatMediaViewer, { MediaSummary } from "./chat-media-viewer";
import { formatTime } from "@/lib/utils";
import { getAvatarInitials } from "@/lib/image-utils";

/**
 * Example component showing how to display chat messages with media
 * This can be integrated into your existing chat system
 */
const ChatMessageWithMedia = ({ message, isOwnMessage = false }) => {
  const { id, message: messageText, acttachmets, created_at, user } = message;

  const senderName = user?.name || "Unknown User";
  const senderAvatar = user?.image || "/images/avatar/default.jpg";
  const messageTime = formatTime(created_at);

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        } items-start gap-3 max-w-2xl`}
      >
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback className="text-xs">
            {getAvatarInitials(senderName)}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div
          className={`flex flex-col ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {/* Sender Name */}
          <span className="text-xs text-muted-foreground mb-1">
            {senderName}
          </span>

          {/* Message with Media */}
          <div
            className={`rounded-lg p-3 ${
              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <ChatMediaViewer
              acttachmets={acttachmets}
              messageText={messageText}
              senderName={senderName}
              messageTime={messageTime}
            />
          </div>

          {/* Message Time */}
          <span className="text-xs text-muted-foreground mt-1">
            {messageTime}
          </span>

          {/* Media Summary (optional) */}
          {acttachmets && acttachmets.length > 0 && (
            <div className="mt-1">
              <MediaSummary acttachmets={acttachmets} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Example of how to use in a chat component
 */
const ChatMessagesExample = ({ messages }) => {
  return (
    <div className="chat-messages-container">
      {messages.map((message) => (
        <ChatMessageWithMedia
          key={message.id}
          message={message}
          isOwnMessage={message.user_id === 42} // Replace with current user ID
        />
      ))}
    </div>
  );
};

/**
 * Example of processing real API response
 */
const processMessageFromAPI = (apiMessage) => {
  return {
    id: apiMessage.id,
    message: apiMessage.message,
    acttachmets: apiMessage.acttachmets || [],
    created_at: apiMessage.created_at,
    user: apiMessage.user,
  };
};

export default ChatMessageWithMedia;
export { ChatMessagesExample, processMessageFromAPI };

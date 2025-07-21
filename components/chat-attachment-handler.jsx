"use client";
import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import {
  getFileIcon,
  formatFileSize,
  isImageAttachment,
  getAttachmentDisplayName,
  getAttachmentSize,
  getAttachmentType,
} from "@/lib/chat-utils";

/**
 * Component to render attachments in chat messages
 * Works with the real API structure: acttachmets array with type, name, size, link
 */
const ChatAttachmentHandler = ({ acttachmets, userRole = "student" }) => {
  if (!acttachmets || acttachmets.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      {acttachmets.map((attachment, index) => (
        <div key={attachment.id || index} className="max-w-xs">
          {/* Image Attachments */}
          {isImageAttachment(attachment.type) && (
            <div className="relative group">
              <Image
                src={attachment.link}
                alt={getAttachmentDisplayName(attachment)}
                width={200}
                height={150}
                className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(attachment.link, "_blank")}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0"
                  onClick={() => window.open(attachment.link, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* File Attachments */}
          {!isImageAttachment(attachment.type) && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border">
              <Icon
                icon={getFileIcon(attachment.type)}
                className="w-5 h-5 text-primary"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {getAttachmentDisplayName(attachment)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getAttachmentSize(attachment)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  if (attachment.link) {
                    window.open(attachment.link, "_blank");
                  }
                }}
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Component to display attachment info in message preview
 */
const AttachmentPreview = ({ acttachmets }) => {
  if (!acttachmets || acttachmets.length === 0) return null;

  const totalSize = acttachmets.reduce((sum, att) => {
    const size = parseFloat(att.size) || 0;
    return sum + size;
  }, 0);
  const imageCount = acttachmets.filter((att) =>
    isImageAttachment(att.type)
  ).length;
  const fileCount = acttachmets.length - imageCount;

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Icon icon="tabler:paperclip" className="w-3 h-3" />
      <span>
        {acttachmets.length} attachment{acttachmets.length > 1 ? "s" : ""}
        {imageCount > 0 && ` (${imageCount} image${imageCount > 1 ? "s" : ""})`}
        {fileCount > 0 && ` (${fileCount} file${fileCount > 1 ? "s" : ""})`}
        {` • ${totalSize.toFixed(2)} KB`}
      </span>
    </div>
  );
};

/**
 * Utility function to process attachments from API response
 */
export const processAttachmentsFromAPI = (message) => {
  if (!message.acttachmets || !Array.isArray(message.acttachmets)) {
    return [];
  }

  return message.acttachmets.map((attachment) => ({
    id: attachment.id,
    type: attachment.type,
    name: attachment.name,
    size: attachment.size,
    link: attachment.link,
  }));
};

/**
 * Example of how to use in existing chat components
 */
const ExampleUsage = ({ message }) => {
  const processedAttachments = processAttachmentsFromAPI(message);

  return (
    <div className="message-container">
      {/* Message text */}
      <div className="message-text">{message.message}</div>

      {/* Attachments */}
      <ChatAttachmentHandler acttachmets={processedAttachments} />

      {/* Attachment preview in message list */}
      <AttachmentPreview acttachmets={processedAttachments} />
    </div>
  );
};

export default ChatAttachmentHandler;
export { AttachmentPreview, processAttachmentsFromAPI };

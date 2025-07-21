"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { Paperclip, X, SendHorizontal, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  sendMessageWithAttachments,
  validateFile,
  formatFileSize,
  getFileIcon,
  cleanupPreviews,
  getAttachmentDisplayName,
  getAttachmentSize,
  getAttachmentType,
  isImageAttachment,
} from "@/lib/chat-utils";
import toast from "react-hot-toast";

const ChatAttachmentExample = ({ chatId, userId }) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event, type = "file") => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      // Validate file
      const validation = validateFile(file);

      if (!validation.isValid) {
        toast.error(validation.errors.join(", "));
        return;
      }

      const attachment = {
        id: Date.now() + Math.random(),
        file,
        attach_name: file.name,
        attach_size: file.size,
        attach_type: file.type,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      };

      setAttachments((prev) => [...prev, attachment]);
    });

    // Reset input
    event.target.value = "";
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const attachment = prev.find((att) => att.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((att) => att.id !== id);
    });
  };

  // Send message with attachments
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Allow sending if there are attachments even without message text
    if (!message.trim() && attachments.length === 0) {
      toast.error("Please enter a message or attach files");
      return;
    }

    if (!chatId || !userId) {
      toast.error("Chat ID and User ID are required");
      return;
    }

    setIsSending(true);

    try {
      // Extract File objects from attachments
      const files = attachments.map((att) => att.file);

      // Send message with attachments (message can be empty if attachments exist)
      const response = await sendMessageWithAttachments(
        chatId,
        message.trim(),
        files,
        userId
      );

      if (response.success) {
        toast.success("Message sent successfully!");

        // Clear form
        setMessage("");
        cleanupPreviews(attachments);
        setAttachments([]);
      } else {
        toast.error(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanupPreviews(attachments);
    };
  }, []);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold">Chat with Attachments</h3>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="border rounded-lg p-3 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">
            Attachments ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-2 bg-white rounded border"
              >
                {/* Image Preview */}
                {attachment.preview && (
                  <Image
                    src={attachment.preview}
                    alt={attachment.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                )}

                {/* File Icon */}
                {!attachment.preview && (
                  <Icon
                    icon={getFileIcon(attachment.type)}
                    className="w-5 h-5 text-primary"
                  />
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getAttachmentDisplayName(attachment)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getAttachmentSize(attachment)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Form */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isSending}
          />

          {/* Attachment Buttons */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={isSending}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>

            <Button
              type="submit"
              disabled={
                isSending || (!message.trim() && attachments.length === 0)
              }
            >
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          onChange={(e) => handleFileSelect(e, "file")}
        />

        <input
          ref={imageInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e, "image")}
        />
      </form>

      {/* Usage Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Supported file types:</strong> Images (JPG, PNG, GIF, WebP),
          PDF, Word documents, text files, ZIP, RAR
        </p>
        <p>
          <strong>Maximum file size:</strong> 10MB per file
        </p>
        <p>
          <strong>Multiple files:</strong> You can attach multiple files to a
          single message
        </p>
      </div>
    </div>
  );
};

export default ChatAttachmentExample;

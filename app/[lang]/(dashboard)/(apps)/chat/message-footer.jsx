"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import {
  Annoyed,
  SendHorizontal,
  Paperclip,
  Image as ImageIcon,
  X,
} from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const MessageFooter = ({
  handleSendMessage,
  replay,
  setReply,
  replayData,
  setReplyData,
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const { toast } = useToast();

  const handleChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto"; // Reset the height to auto to adjust
    e.target.style.height = `${e.target.scrollHeight - 15}px`;
  };

  const handleSelectEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };

  // File handling functions
  const handleFileSelect = (event, type = "file") => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file types
      if (type === "image") {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please select an image file",
            variant: "destructive",
          });
          return;
        }
      }

      const attachment = {
        id: Date.now() + Math.random(),
        file,
        type: type,
        name: file.name,
        size: file.size,
        preview: type === "image" ? URL.createObjectURL(file) : null,
      };

      setAttachments((prev) => [...prev, attachment]);
    });

    // Reset input
    event.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const attachment = prev.find((att) => att.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((att) => att.id !== id);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() && attachments.length === 0) return;

    // Send everything as a single message with file data included
    const messageData = {
      message: message.trim(), // Ensure this is a string
      time: new Date().toISOString(),
      replayMetadata: false,
      attachments: attachments.map((att) => ({
        type: att.type,
        name: att.name,
        size: att.size,
        file: att.file,
      })),
    };

    handleSendMessage(messageData);
    setReply(false);
    setMessage("");
    setAttachments([]);
  };

  return (
    <>
      {replay && (
        <div className=" w-full px-6 py-4 flex justify-between gap-4 items-center">
          <div>
            <div className="font-semibold text-base text-default-700 mb-1">
              Replying to {replayData?.contact?.fullName}
            </div>
            <div className="truncate">
              <span className="text-sm text-muted-foreground">
                {replayData?.message}
              </span>
            </div>
          </div>
          <span className="cursor-pointer " onClick={() => setReply(false)}>
            <Icon
              icon="heroicons:x-mark-20-solid"
              className="text-2xl text-default-900"
            />
          </span>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-default-200">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 bg-muted rounded-lg p-2 max-w-xs"
              >
                {attachment.type === "image" && attachment.preview && (
                  <Image
                    src={attachment.preview}
                    alt={attachment.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                )}
                {attachment.type === "file" && (
                  <Icon
                    icon="tabler:file-filled"
                    className="w-5 h-5 text-primary"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {attachment.name}
                  </p>
                  {attachment.size && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                  )}
                </div>
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

      <div
        className="w-full flex items-end gap-1 lg:gap-4 lg:px-4 relative p-2 py-4 border-t border-default-200"
        style={{
          boxSizing: "border-box",
        }}
      >
        <div className="flex-none flex gap-1 absolute md:static top-0 left-1.5 z-10 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full hover:bg-default-50"
              >
                <Paperclip className="w-5 h-5 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[200px] p-2 rounded-xl"
              align="start"
              side="top"
            >
              <DropdownMenuItem
                className="py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon
                  icon="tabler:file-filled"
                  className="w-4 h-4 mr-2 text-primary"
                />
                <span className="text-sm">Attach File</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">Attach Image</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt,.zip,.rar,.mp3,.mp4,.avi,.mov"
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
        </div>

        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-1 relative">
              <textarea
                value={message}
                onChange={handleChange}
                placeholder="Type your message... (you can include links naturally)"
                className="bg-background border border-default-200 outline-none focus:border-primary rounded-xl break-words pl-8 md:pl-3 px-3 flex-1 h-10 pt-2 p-1 pr-8 no-scrollbar"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{
                  minHeight: "40px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  resize: "none",
                }}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <span className="absolute ltr:right-12 rtl:left-12 bottom-1.5 h-7 w-7 rounded-full cursor-pointer">
                    <Annoyed className="w-6 h-6 text-primary" />
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-fit p-0 shadow-none border-none bottom-0 rtl:left-5 ltr:-left-[110px]"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleSelectEmoji}
                    theme="light"
                  />
                </PopoverContent>
              </Popover>

              <Button
                type="submit"
                disabled={!message.trim() && attachments.length === 0}
                className="rounded-full bg-default-200 hover:bg-default-300 h-[42px] w-[42px] p-0 self-end disabled:opacity-50"
              >
                <SendHorizontal className="w-5 h-8 text-primary rtl:rotate-180" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MessageFooter;

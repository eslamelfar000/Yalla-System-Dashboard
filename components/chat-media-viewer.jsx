"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Download,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getFileIcon,
  getAttachmentDisplayName,
  getAttachmentSize,
  isImageAttachment,
} from "@/lib/chat-utils";

/**
 * Component to show media attachments in chat messages
 * Handles images, PDFs, and other file types
 */
const ChatMediaViewer = ({
  acttachmets,
  messageText,
  senderName,
  messageTime,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!acttachmets || acttachmets.length === 0) return null;

  const imageAttachments = acttachmets.filter((att) =>
    isImageAttachment(att.type)
  );
  const fileAttachments = acttachmets.filter(
    (att) => !isImageAttachment(att.type)
  );

  const openImageModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (currentImageIndex < imageAttachments.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setSelectedImage(imageAttachments[currentImageIndex + 1]);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setSelectedImage(imageAttachments[currentImageIndex - 1]);
    }
  };

  return (
    <>
      {/* Message Container */}
      <div className="message-container">
        {/* Message Text */}
        {messageText && <div className="message-text mb-2">{messageText}</div>}

        {/* Image Attachments Grid */}
        {imageAttachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
            {imageAttachments.map((image, index) => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.link}
                  alt={getAttachmentDisplayName(image)}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity w-full h-32"
                  onClick={() => openImageModal(image, index)}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(image.link, "_blank")}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Attachments */}
        {fileAttachments.length > 0 && (
          <div className="space-y-2">
            {fileAttachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg border"
              >
                <Icon
                  icon={getFileIcon(file.type)}
                  className="w-8 h-8 text-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getAttachmentDisplayName(file)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getAttachmentSize(file)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (file.link) {
                      window.open(file.link, "_blank");
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Message Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{senderName}</span>
          <span>{messageTime}</span>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 z-10"
              onClick={closeImageModal}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation Buttons */}
            {imageAttachments.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={nextImage}
                  disabled={currentImageIndex === imageAttachments.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image */}
            <Image
              src={selectedImage.link}
              alt={getAttachmentDisplayName(selectedImage)}
              width={800}
              height={600}
              className="rounded-lg object-contain max-w-full max-h-full"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded">
              <p className="text-sm font-medium">
                {getAttachmentDisplayName(selectedImage)}
              </p>
              <p className="text-xs">
                {currentImageIndex + 1} of {imageAttachments.length} •{" "}
                {getAttachmentSize(selectedImage)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Component to show attachment summary in message list
 */
const MediaSummary = ({ acttachmets }) => {
  if (!acttachmets || acttachmets.length === 0) return null;

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
      </span>
    </div>
  );
};

export default ChatMediaViewer;
export { MediaSummary };

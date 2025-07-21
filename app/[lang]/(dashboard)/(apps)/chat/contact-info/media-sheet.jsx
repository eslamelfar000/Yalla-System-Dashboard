"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useGetData } from "@/hooks/useGetData";
import {
  ImageGridSkeleton,
  FileListSkeleton,
  LinkListSkeleton,
} from "@/components/ui/media-skeleton";
import { Download, ExternalLink } from "lucide-react";

const MediaSheet = ({ showDrawer, handleDrawer, chatId }) => {
  const {
    data: mediaData,
    isLoading,
    error,
  } = useGetData({
    endpoint: `dashboard/chats/media/${chatId}`,
    queryKey: ["chat-media", chatId],
    enabled: !!chatId,
  });

  const formatFileSize = (size) => {
    if (typeof size === "string") {
      return size;
    }
    if (typeof size === "number") {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
    return "Unknown size";
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "mdi:file-pdf-box";
      case "doc":
      case "docx":
        return "mdi:file-word-box";
      case "xls":
      case "xlsx":
        return "mdi:file-excel-box";
      case "ppt":
      case "pptx":
        return "mdi:file-powerpoint-box";
      case "txt":
        return "mdi:file-text-box";
      default:
        return "mdi:file-document-outline";
    }
  };

  return (
    <div className="h-full">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="mb-0">
          <div className="flex gap-2.5 items-center">
            <Button
              type="button"
              size="icon"
              className="rounded-full bg-transparent hover:bg-default-200"
              onClick={() => handleDrawer(null)}
            >
              <Icon
                icon="mynaui:arrow-left"
                className="text-default-900 text-2xl"
              />
            </Button>
            <span className="text-base font-medium text-default-900">
              Media, Files and Links
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-5 h-full">
          <Tabs
            defaultValue={showDrawer ? showDrawer : "media"}
            className="h-full "
          >
            <TabsList className="flex flex-wrap gap-2 dark:border dark:border-border">
              <TabsTrigger value="media" className="flex-1">
                Media
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1">
                Files
              </TabsTrigger>
              <TabsTrigger value="links" className="flex-1">
                Links
              </TabsTrigger>
            </TabsList>
            <div className="h-[calc(100%-91px)] ">
              <ScrollArea className="h-full">
                <TabsContent value="media">
                  {isLoading ? (
                    <ImageGridSkeleton />
                  ) : error ? (
                    <div className="flex items-center justify-center h-32 text-default-500">
                      <Icon
                        icon="heroicons:exclamation-triangle"
                        className="w-6 h-6 mr-2"
                      />
                      Failed to load images
                    </div>
                  ) : !mediaData?.data?.images ||
                    mediaData.data.images.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-default-500">
                      <Icon icon="heroicons:photo" className="w-6 h-6 mr-2" />
                      No images found
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mt-8">
                      {mediaData.data.images.map((image) => (
                        <div key={image.id} className="relative group">
                          <Image
                            src={image.link}
                            alt={image.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(image.link, "_blank")}
                            onError={(e) => {
                              console.warn("Failed to load image:", image.link);
                              e.target.style.display = "none";
                            }}
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
                </TabsContent>
                <TabsContent value="files">
                  {isLoading ? (
                    <FileListSkeleton />
                  ) : error ? (
                    <div className="flex items-center justify-center h-32 text-default-500">
                      <Icon
                        icon="heroicons:exclamation-triangle"
                        className="w-6 h-6 mr-2"
                      />
                      Failed to load files
                    </div>
                  ) : !mediaData?.data?.files ||
                    mediaData.data.files.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-default-500">
                      <Icon
                        icon="heroicons:document"
                        className="w-6 h-6 mr-2"
                      />
                      No files found
                    </div>
                  ) : (
                    <div className="space-y-2 mt-8">
                      {mediaData.data.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2 border-b border-default-200 group py-2 last:border-none cursor-pointer hover:bg-default-50 rounded-lg p-2"
                          onClick={() => window.open(file.link, "_blank")}
                        >
                          <div className="h-16 w-16 rounded-sm bg-default-50 flex justify-center items-center">
                            <Icon
                              icon={getFileIcon(file.name)}
                              className="text-3xl text-default-700"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-default-500 group-hover:text-default-800 truncate">
                              {file.name}
                            </div>
                            <p className="text-sm text-default-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.link, "_blank");
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="links">
                  {isLoading ? (
                    <LinkListSkeleton />
                  ) : error ? (
                    <div className="flex items-center justify-center h-32 text-default-500">
                      <Icon
                        icon="heroicons:exclamation-triangle"
                        className="w-6 h-6 mr-2"
                      />
                      Failed to load links
                    </div>
                  ) : !mediaData?.data?.links ||
                    mediaData.data.links.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-default-500">
                      <Icon icon="heroicons:link" className="w-6 h-6 mr-2" />
                      No links found
                    </div>
                  ) : (
                    <div className="space-y-2 mt-8">
                      {mediaData.data.links.map((link, index) => (
                        <Link
                          key={index}
                          target="_blank"
                          href={link}
                          className="flex items-center gap-2 border-b border-default-200 group py-2 last:border-none hover:bg-default-50 rounded-lg p-2"
                        >
                          <div className="h-16 w-16 rounded-sm bg-default-50 flex justify-center items-center">
                            <Icon
                              icon="bx:link"
                              className="text-3xl text-default-700"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-default-500 group-hover:text-default-800 truncate">
                              {new URL(link).hostname}
                            </div>
                            <p className="text-sm text-default-500 truncate">
                              {link}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(link, "_blank");
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaSheet;

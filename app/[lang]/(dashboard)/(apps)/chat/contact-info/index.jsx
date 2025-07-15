"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import MuteNotification from "./mute-notification";
import EditNickname from "./edit-nickname";
import ChangeTheme from "./change-theme";
import BlockUser from "./block-user";
import MediaSheet from "./media-sheet";
import { AlertTriangle, FolderClosed, Image } from "lucide-react";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import { safeToString } from "@/lib/utils";

const ContactInfo = ({ handleShowInfo, contact }) => {
  const [showDrawer, setShowDrawer] = useState(null);

  const handleDrawer = (itemKey) => {
    setShowDrawer(itemKey);
  };

  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== "object") {
    console.warn("Invalid contact object in ContactInfo:", contact);
    return null;
  }

  // Handle different data structures from API
  const {
    id,
    chat_id,
    user_id,
    name,
    fullName,
    role,
    avatar,
    image,
    status = "offline",
    about,
    bio,
    last_message,
    lastMessage,
    unread_count,
    unreadmessage,
    unseenMsgs,
    updated_at,
    created_at,
    date,
  } = contact;

  // Use the appropriate fields based on what's available
  const chatId = id || chat_id;
  const userName = safeToString(name || fullName || role || "Unknown User");
  const userAvatar = fixImageUrl(avatar?.src || image || avatar);
  const userAbout = safeToString(about || bio || "No status");

  // If MediaSheet is active, show it instead of the main content
  if (showDrawer !== null) {
    return (
      <div className="h-full">
        <MediaSheet showDrawer={showDrawer} handleDrawer={handleDrawer} />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Card className="h-full rounded-md border-0">
        <CardHeader className="mb-0">
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16 lg:h-24 lg:w-24">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{getAvatarInitials(userName)}</AvatarFallback>
            </Avatar>
            <div className="mt-3 text-lg lg:text-xl font-semibold text-default-900">
              {userName}
            </div>
            <span className="text-sm text-default-600 capitalize  text-center line-clamp-2">
              {userAbout}
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-0 border-0 h-[calc(100%-260px)] overflow-hidden ">
          <ScrollArea className="h-full md:pb-10">
            <Accordion type="single" collapsible className="w-full  space-y-0 ">
              <AccordionItem
                value="item-2"
                className="shadow-none dark:shadow-none dark:bg-card/90 px-4"
              >
                <AccordionTrigger>Shared Files</AccordionTrigger>
                <AccordionContent>
                  <div>
                    <Button
                      type="button"
                      className="w-full justify-start gap-3  bg-transparent hover:bg-default-50 px-1.5 group"
                      onClick={() => handleDrawer("media")}
                    >
                      <span className="w-5 h-5 rounded-full bg-default-200 group-hover:bg-default-300 flex justify-center items-center">
                        <Image className="w-3.5 h-3.5 text-default-400" />
                      </span>
                      <span className="text-xs text-default-600">Media</span>
                    </Button>
                    <Button
                      type="button"
                      className="w-full justify-start gap-3  bg-transparent hover:bg-default-50 group px-1.5"
                      onClick={() => handleDrawer("files")}
                    >
                      <span className="w-5 h-5 rounded-full bg-default-200 group-hover:bg-default-300 flex justify-center items-center">
                        <FolderClosed className="w-3 h-3 text-default-500" />
                      </span>
                      <span className="text-xs text-default-600">File</span>
                    </Button>
                    <Button
                      type="button"
                      className="w-full justify-start gap-3  bg-transparent hover:bg-default-50 group px-1"
                      onClick={() => handleDrawer("links")}
                    >
                      <span className="w-5 h-5 rounded-full bg-default-200 group-hover:bg-default-300 flex justify-center items-center">
                        <Icon
                          icon="heroicons:link"
                          className="w-3 h-3 text-default-500"
                        />
                      </span>
                      <span className="text-xs text-default-600">Links</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;

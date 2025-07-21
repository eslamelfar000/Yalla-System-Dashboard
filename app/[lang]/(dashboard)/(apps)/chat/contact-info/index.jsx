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
import { useAuth } from "@/hooks/use-auth";

// Utility function to extract student and teacher from participants
const extractStudentAndTeacher = (participants) => {
  if (!participants || !Array.isArray(participants)) {
    return { student: null, teacher: null };
  }

  let student = null;
  let teacher = null;

  participants.forEach((participant) => {
    if (participant.user) {
      if (participant.user.role === "student") {
        student = participant.user;
      } else if (participant.user.role === "teacher") {
        teacher = participant.user;
      }
    }
  });

  return { student, teacher };
};

const ContactInfo = ({ handleShowInfo, contact }) => {
  const [showDrawer, setShowDrawer] = useState(null);
  const { user } = useAuth();
  const userRole = user?.role || null;

  const handleDrawer = (itemKey) => {
    setShowDrawer(itemKey);
  };

  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== "object") {
    console.warn("Invalid contact object in ContactInfo:", contact);
    return null;
  }

  // Handle different data structures based on user role
  let chatId, userName, userAvatar, userAbout, status;

  if (userRole === "admin") {
    // Admin data structure - extract from participants array
    const { id, participants, status: chatStatus } = contact;

    // Extract student and teacher from participants
    const { student, teacher } = extractStudentAndTeacher(participants);

    chatId = id;
    userName =
      student && teacher
        ? `${safeToString(student.name)} ↔ ${safeToString(teacher.name)}`
        : student
        ? safeToString(student.name)
        : teacher
        ? safeToString(teacher.name)
        : "Unknown Chat";

    // Use teacher image as main avatar, fallback to student image
    userAvatar = fixImageUrl(teacher?.image || student?.image);

    userAbout =
      student && teacher
        ? `Student: ${safeToString(student.name)} | Teacher: ${safeToString(
            teacher.name
          )}`
        : student
        ? `Student: ${safeToString(student.name)}`
        : teacher
        ? `Teacher: ${safeToString(teacher.name)}`
        : "Chat";

    status = chatStatus || "offline";
  } else {
    // Teacher data structure - single user info
    const {
      id,
      chat_id,
      name,
      fullName,
      role,
      avatar,
      image,
      status: userStatus = "offline",
      about,
      bio,
    } = contact;

    chatId = id || chat_id;
    userName = safeToString(name || fullName || role || "Unknown User");
    userAvatar = fixImageUrl(avatar?.src || image || avatar);
    userAbout = safeToString(about || bio || "No status");
    status = userStatus;
  }

  // If MediaSheet is active, show it instead of the main content
  if (showDrawer !== null) {
    return (
      <div className="h-full">
        <MediaSheet
          showDrawer={showDrawer}
          handleDrawer={handleDrawer}
          chatId={chatId}
        />
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
            <div className="mt-3 text-md lg:text-lg font-semibold text-default-900 text-center">
              {userName}
            </div>
            <span className="text-sm text-default-600 capitalize  text-center line-clamp-2">
              {userAbout}
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-0 border-0 h-[calc(100%-260px)] overflow-hidden ">
          <ScrollArea className="h-full">
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
                      className="w-full justify-start gap-3 bg-transparent hover:bg-gray-200 px-1.5 group mb-2"
                      onClick={() => handleDrawer("media")}
                    >
                      <Image className="w-8 h-8 text-primary bg-gray-200 rounded-full p-2 flex justify-center items-center" />
                      <span className="text-xs text-primary">Media</span>
                    </Button>
                    <Button
                      type="button"
                      className="w-full justify-start gap-3 bg-transparent hover:bg-gray-200 group px-1.5 mb-2"
                      onClick={() => handleDrawer("files")}
                    >
                      <FolderClosed className="w-8 h-8 text-primary bg-gray-200 rounded-full p-2 flex justify-center items-center" />
                      <span className="text-xs text-primary">File</span>
                    </Button>
                    <Button
                      type="button"
                      className="w-full justify-start gap-3 bg-transparent hover:bg-gray-200 group px-1"
                      onClick={() => handleDrawer("links")}
                    >
                      <Icon
                        icon="heroicons:link"
                        className="w-8 h-8 text-primary bg-gray-200 rounded-full p-2 flex justify-center items-center"
                      />
                      <span className="text-xs text-primary">Links</span>
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

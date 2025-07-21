"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, safeToString } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
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

const MessageHeader = ({ contact, showInfo, handleShowInfo }) => {
  const isLg = useMediaQuery("(max-width: 1024px)");
  const { user } = useAuth();
  const userRole = user?.role || null;

  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== "object") {
    console.warn("Invalid contact object in MessageHeader:", contact);
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
      name,
      fullName,
      role,
      avatar,
      image,
      status: userStatus = "offline",
      about,
      bio,
    } = contact;

    chatId = id;
    userName = safeToString(name || fullName || role || "Unknown User");
    userAvatar = fixImageUrl(avatar?.src || image || avatar);
    userAbout = safeToString(about || bio);
    status = userStatus;
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="uppercase text-xs bg-primary/50">
              {getAvatarInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <Badge
            className={cn(
              "h-2 w-2 p-0 absolute bottom-0 right-0 ring-2 ring-background",
              {
                "bg-green-500": status === "online",
                "bg-gray-400": status !== "online",
              }
            )}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">{userName}</h3>
          <p className="text-xs text-muted-foreground">{userAbout}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isLg && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost "
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    showInfo ? "bg-primary text-white" : "bg-primary/10 text-primary hover:text-white"
                  }`}
                  onClick={handleShowInfo}
                >
                  <Icon
                    icon="lucide:info"
                    className={`h-4 w-4`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;

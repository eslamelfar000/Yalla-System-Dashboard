import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/lib/auth-utils";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import { safeToString } from "@/lib/utils";

const MyProfileHeader = ({ profile }) => {
  const userData = getUserData();

  // Safety check: ensure profile is a valid object
  if (!profile || typeof profile !== "object") {
    console.warn("Invalid profile object in MyProfileHeader:", profile);
    return null;
  }

  // Handle different data structures from API
  const {
    id,
    user_id,
    name,
    fullName,
    avatar,
    image,
    bio,
    about,
    status = "online",
  } = profile;

  // Use the appropriate fields based on what's available
  const userName = safeToString(name || fullName || userData?.name || "User");
  const userAvatar = fixImageUrl(
    avatar?.src || image || avatar || userData?.image
  );
  const userBio = safeToString(bio || about || "Online");

  return (
    <div className="space-y-4">
      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-sm">
            {getAvatarInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {userName}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground truncate">{userBio}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfileHeader;

"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { getUserData, removeAuthToken, removeUserData } from "@/lib/auth-utils";
import { useMutate } from "@/hooks/useMutate";
import { useRouter } from "next/navigation";

const ProfileInfo = () => {
  const [userData, setUserData] = React.useState(null);

  const router = useRouter();

  // Function to update user data from localStorage
  const updateUserDataFromStorage = () => {
    const user = getUserData();
    setUserData(user);
  };

  React.useEffect(() => {
    // Get initial user data from localStorage
    updateUserDataFromStorage();

    // Listen for storage changes (when updated from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "user_data") {
        updateUserDataFromStorage();
      }
    };

    // Listen for custom profile update events
    const handleProfileUpdate = () => {
      updateUserDataFromStorage();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleProfileUpdate);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Logout mutation
  const logoutMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/logout",
    text: "Logged out successfully",
    onSuccess: () => {
      // Clear local data regardless of API response
      removeAuthToken();
      removeUserData();
      router.push("/");
    },
    // onError: (error) => {
    // removeAuthToken();
    // removeUserData();
    // router.push("/");
    // },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Function to check if image URL is valid
  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;

    // Check if it's a valid URL and has an image file extension
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();

      // Check if it has a proper image extension or is not just the hostname
      return (
        pathname !== "/" &&
        (pathname.includes(".jpg") ||
          pathname.includes(".jpeg") ||
          pathname.includes(".png") ||
          pathname.includes(".gif") ||
          pathname.includes(".webp") ||
          pathname.includes(".bmp") ||
          pathname.includes("/storage/") ||
          pathname.includes("/uploads/") ||
          pathname.includes("/images/"))
      );
    } catch {
      return false;
    }
  };

  // If no user data, don't render the component
  if (!userData) {
    return null;
  }

  const hasValidImage = isValidImageUrl(userData.image);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <div className=" flex items-center  ">
          {hasValidImage ? (
            <Image
              src={userData.image}
              alt={userData?.image || ""}
              width={36}
              height={36}
              className="w-[40px] h-[40px] rounded-full border-2 border-primary"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="heroicons:user" className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          {hasValidImage ? (
            <Image
              src={userData.image}
              alt={userData.image || ""}
              width={36}
              height={36}
              className="w-[40px] h-[40px] rounded-full border-2 border-primary"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="heroicons:user" className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-default-800 capitalize ">
              {userData?.name || "User"}
            </div>
            <div className="text-[10px] text-default-600">
              {userData?.email || ""}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {[
            {
              name: "profile",
              icon: "heroicons:user",
              href: "/user-profile",
            },
            {
              name: "Settings",
              icon: "heroicons:cog-6-tooth",
              href: "/user-profile/settings",
            },
          ].map((item, index) => (
            <Link
              href={item.href}
              key={`info-menu-${index}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                <Icon icon={item.icon} className="w-4 h-4" />
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
          disabled={logoutMutation.isPending}
        >
          <Icon icon="heroicons:power" className="w-4 h-4" />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileInfo;

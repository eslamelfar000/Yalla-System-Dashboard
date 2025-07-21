"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  Location,
  CalenderCheck,
  ClipBoard,
  Envelope,
} from "@/components/svg";
import { useUserData } from "../profile-layout";
import Cookies from "js-cookie";

const UserInfo = () => {
  const { userData, isLoading } = useUserData();

  // If no user data, show skeleton or loading state
  if (isLoading || !userData) {
    return (
      <Card className="h-full">
        <CardHeader className="border-none mb-0">
          <CardTitle className="text-lg font-medium text-default-800">
            Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="mt-4 space-y-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center animate-pulse">
                <div className="flex-none 2xl:w-56 flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if user is a teacher
  const isTeacher =
    userData?.role === "teacher" || userData?.role === "Teacher" || Cookies.get("user_role") === "teacher" || userData?.teacher?.role === "teacher";

  const userInfo = [
    {
      icon: User,
      label: "Full Name",
      value: userData?.name || "N/A",
    },
    {
      icon: Phone,
      label: "Mobile",
      value: userData?.phone || "N/A",
    },
    {
      icon: Envelope,
      label: "Email Address",
      value: userData?.email || "N/A",
    },
    {
      icon: Location,
      label: "Location",
      value: userData?.location || userData?.country || "N/A",
    },
    {
      icon: CalenderCheck,
      label: "Target",
      value: `${userData?.target}%` || "85%",
    },
    // Only show language for teachers
    ...(isTeacher
      ? [
          {
            icon: ClipBoard,
            label: "Language",
            value: userData?.teacher?.languages || userData?.languages || "English",
          },
        ]
      : []),
  ];
  return (
    <Card className="h-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">
          Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <ul className="mt-4 space-y-6">
          {userInfo.map((item, index) => (
            <li key={`user-info-${index}`} className="flex justify-between items-center">
              <div className="flex-none  2xl:w-56 flex items-center gap-1.5">
                <span>{item.icon && <item.icon className="w-4 h-4 mr-2 text-primary" />}</span>
                <span className="text-sm font-medium text-default-800">
                  {item.label}:
                </span>
              </div>
              <div className="flex-1 text-xs text-default-700 text-right">
                {item.value}
              </div>
            </li>
          ))}
        </ul>
        {/* <div className="mt-6 text-lg font-medium text-default-800 mb-4">Active Teams</div>
        <div className="space-y-3">
          {
            [
              {
                title: "UI/UX Designer",
                img: FigmaImage,
                total: 65
              },
              {
                title: "Frontend Developer",
                img: ReactImage,
                total: 126
              }
            ].map((item, index) => (
              <div
                key={`active-team-${index}`}
                className="flex items-center gap-2"
              >
                <Image src={item.img} alt={item.title} className="w-4 h-4" />
                <div className="text-sm font-medium text-default-800">
                  {item.title}
                  <span className="font-normal">
                    ({item.total} members)
                  </span>
                </div>
              </div>
            ))
          }
        </div> */}
      </CardContent>
    </Card>
  );
};

export default UserInfo;

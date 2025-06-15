"use client";
import { UserSign, Web, Mail2 } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useUserData } from "../profile-layout";
import { MapPin } from "lucide-react";

const About = ({ course }) => {
  const { userData } = useUserData();

  // Check if user is a teacher
  const isTeacher =
    userData?.role === "teacher" || userData?.role === "Teacher";

  // Don't show course section for non-teachers
  if (course && !isTeacher) {
    return null;
  }

  // Default content if no user data or specific content
  const getAboutContent = () => {
    if (!userData) {
      return "Loading user information...";
    }

    if (course) {
      return (
        userData.about_course ||
        "No course information available. Please update your profile to add information about your courses."
      );
    } else {
      return (
        userData.about_me ||
        "No personal information available. Please update your profile to add information about yourself."
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center mb-3 border-none">
        <CardTitle className="text-lg font-medium text-default-800">
          {course ? "About Course" : "About Me"}
        </CardTitle>
        {/* <Button
          size="icon"
          className="w-6 h-6 bg-default-100 dark:bg-default-50 text-default-500 hover:bg-default-100"
        >
          <Icon icon="heroicons:ellipsis-vertical" className="w-4 h-4" />
        </Button> */}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-default-600 mb-3 whitespace-pre-wrap">
          {getAboutContent()}
        </div>

        {/* Show user info only for About Me section */}
        {!course && userData && (
          <div className="mt-6 flex flex-wrap items-center gap-6 2xl:gap-16">
            {[
              {
                title: "Name",
                position: userData.name || "N/A",
                icon: UserSign,
              },
              {
                title: "Location",
                position: userData.location
                  ? `${userData.location || ""}`.trim() || userData.location
                  : "N/A",
                icon: MapPin,
              },
              {
                title: "Email",
                position: userData.email || "N/A",
                icon: Mail2,
              },
            ].map((item, index) => (
              <div key={`about-${index}`} className="flex items-center gap-2">
                <div className="bg-default-100 dark:bg-default-50 text-primary h-10 w-10 grid place-content-center rounded">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-default-800 ">
                    {item.title}
                  </div>
                  <div className="text-xs font-medium text-default-600">
                    {item.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default About;

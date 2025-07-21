"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect, useRef } from "react";
import { CalendarDays, Camera, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { setUserData, updateUserDataFromResponse } from "@/lib/auth-utils";
import { useMutate } from "@/hooks/useMutate";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useUserData } from "../profile-layout";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { MultipleSelector } from "@/components/ui/multiple-selector";
import Cookies from "js-cookie";

const PersonalDetails = () => {
  const [date, setDate] = useState();
  const { userData, updateUserData, isLoading } = useUserData();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const fileInputRef = useRef(null);

  // Language options for multiple selector
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "bangla", label: "Bangla" },
    { value: "arabic", label: "Arabic" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
    { value: "russian", label: "Russian" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
  ];

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Check if user is a teacher
  const isTeacher =
    userData?.role === "teacher" ||
    userData?.role === "Teacher" ||
    Cookies.get("user_role") === "teacher";

  // Profile update mutation
  const profileMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/profile/update",
    text: "Profile updated successfully",
    onSuccess: (response) => {
      try {
        // Use the utility function to handle the response and update localStorage
        const updatedUserData = updateUserDataFromResponse(response);

        if (updatedUserData) {
          // Update the context with new data
          updateUserData(updatedUserData);

          // Update form with latest data from response
          const formResetData = {
            name: updatedUserData.name || "",
            phoneNumber: updatedUserData.phone || "",
            email: updatedUserData.email || "",
            country: updatedUserData.location
              ? updatedUserData.location.split("/")[0]
              : "",
            city: updatedUserData.location
              ? updatedUserData.location.split("/")[1]
              : "",
          };

          // Only include teacher-specific fields if user is a teacher
          if (
            updatedUserData.role === "teacher" ||
            updatedUserData.role === "Teacher" ||
            isTeacher
          ) {
            // Handle languages from teacher object
            const teacherLanguages = updatedUserData.languages || "";
            const languagesArray = teacherLanguages
              ? teacherLanguages.split(",").map((lang) => lang.trim())
              : [];
            setSelectedLanguages(languagesArray);

            formResetData.aboutMe = updatedUserData.about_me || "";
            formResetData.aboutCourse = updatedUserData.about_course || "";
            formResetData.video_link = updatedUserData.video_link || "";
            formResetData.certificate = updatedUserData.certificate || "";
          }

          reset(formResetData);

          // Update image preview with new image URL
          if (updatedUserData.image) {
            setImagePreview(updatedUserData.image);
          }

          // Clear selected image after successful update
          setSelectedImage(null);

          // Clear file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Dispatch custom event to notify other components (like header) about profile update
          window.dispatchEvent(
            new CustomEvent("profileUpdated", {
              detail: updatedUserData,
            })
          );

          // Show success message
        } else {
          toast.error("Failed to update profile data");
        }
      } catch (error) {
        toast.error("Profile updated but failed to refresh data");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  // Load user data on component mount
  useEffect(() => {
    if (userData && !isLoading) {
      // Parse location into country and city
      const locationParts = userData.location
        ? userData.location.split("/")
        : ["", ""];
      const country = locationParts[0] || "";
      const city = locationParts[1] || "";

      // Populate form with user data from localStorage
      const initialFormData = {
        name: userData.name || "",
        phoneNumber: userData.phone || "",
        email: userData.email || "",
        country: country,
        city: city,
      };

      // Only include teacher-specific fields if user is a teacher
      if (
        userData.role === "teacher" ||
        userData.role === "Teacher" ||
        isTeacher ||
        Cookies.get("user_role") === "teacher"
      ) {
        // Handle languages from teacher object
        const teacherLanguages = userData.teacher?.languages || userData.languages || "";
        const languagesArray = teacherLanguages
          ? teacherLanguages.split(",").map((lang) => lang.trim())
          : [];
        setSelectedLanguages(languagesArray);

        initialFormData.aboutMe = userData.teacher?.about_me || userData.about_me || "";
        initialFormData.aboutCourse = userData.teacher?.about_course || userData.about_course || "";
        initialFormData.video_link = userData.teacher?.video_link || userData.video_link || "";
        initialFormData.certificate = userData.teacher?.certificate || userData.certificate || "";
      }

      reset(initialFormData);

      // Set current image preview if user has an image
      if (userData.image) {
        setImagePreview(userData.image);
      }
    }
  }, [userData, isLoading, reset, isTeacher]);

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type - only allow supported formats by GD driver
    const supportedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];

    if (!supportedTypes.includes(file.type.toLowerCase())) {
      toast.error(
        "Please select a valid image file (JPG, PNG, GIF, BMP, or WebP only)"
      );
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview(userData?.image || null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Add basic form fields
    formData.append("name", data.name || "");
    formData.append("phone", data.phoneNumber || "");
    formData.append("email", data.email || "");

    // Only add teacher-specific fields if user is a teacher
    if (isTeacher) {
      // Convert selected languages array to comma-separated string
      const languagesString = selectedLanguages.join(", ");
      formData.append("languages", languagesString);
      formData.append("about_me", data.aboutMe || "");
      formData.append("about_course", data.aboutCourse || "");
      formData.append("video_link", data.video_link || "");
      formData.append("certificate", data.certificate || "");
    }

    // Handle location properly
    const country = data.country || "";
    const city = data.city || "";
    const location =
      country && city ? `${country}/${city}` : country || city || "";
    formData.append("location", location);

    // Add image if selected (ensure it's a valid file)
    if (selectedImage && selectedImage instanceof File) {
      formData.append("image", selectedImage);
    }

    // Use FormData for the mutation
    profileMutation.mutate(formData);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="rounded-t-none pt-6">
        <CardContent>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="col-span-12 md:col-span-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-t-none pt-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload Section */}
          <div className="col-span-12 mb-6">
            <Label className="mb-4 block text-lg font-medium">
              Profile Picture
            </Label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={120}
                      height={120}
                      className="w-[150px] h-[150px] rounded-full object-cover border-4 border-gray-200"
                    />
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={removeImagePreview}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-30 h-30 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                    <Icon
                      icon="heroicons:user"
                      className="w-12 h-12 text-gray-400"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={profileMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Camera size={16} />
                  {imagePreview ? "Change Picture" : "Upload Picture"}
                </Button>
                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF, BMP or WebP. Max size 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="name" className="mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Full name is required" })}
                disabled={profileMutation.isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="phoneNumber" className="mb-2">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                disabled={profileMutation.isPending}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="email" className="mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                disabled={profileMutation.isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {isTeacher && (
              <div className="col-span-12 md:col-span-6">
                <Label htmlFor="languages" className="mb-2">
                  Languages
                </Label>
                <MultipleSelector
                  value={selectedLanguages}
                  onValueChange={setSelectedLanguages}
                  options={languageOptions}
                  placeholder="Select languages..."
                  disabled={profileMutation.isPending}
                />
              </div>
            )}
            <div className="col-span-12 lg:col-span-6">
              <Label htmlFor="country" className="mb-2">
                Country
              </Label>
              <Input
                id="country"
                {...register("country")}
                disabled={profileMutation.isPending}
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Label htmlFor="city" className="mb-2">
                City
              </Label>
              <Input
                id="city"
                {...register("city")}
                disabled={profileMutation.isPending}
              />
            </div>
            {isTeacher && (
              <>
                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="video_link" className="mb-2">
                    Intro Video Link
                  </Label>
                  <Input
                    id="video_link"
                    {...register("video_link")}
                    disabled={profileMutation.isPending}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="certificate" className="mb-2">
                    Certificate
                  </Label>
                  <Input
                    id="certificate"
                    {...register("certificate")}
                    disabled={profileMutation.isPending}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="aboutMe" className="mb-2">
                    About Me
                  </Label>
                  <Textarea
                    id="aboutMe"
                    rows={10}
                    className="resize-none"
                    {...register("aboutMe")}
                    disabled={profileMutation.isPending}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="aboutCourse" className="mb-2">
                    About Course
                  </Label>
                  <Textarea
                    id="aboutCourse"
                    rows={10}
                    className="resize-none"
                    {...register("aboutCourse")}
                    disabled={profileMutation.isPending}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                // Reset form with role-specific fields
                const resetData = {
                  name: userData?.name || "",
                  phoneNumber: userData?.phone || "",
                  email: userData?.email || "",
                  country: userData?.location
                    ? userData.location.split("/")[0]
                    : "",
                  city: userData?.location
                    ? userData.location.split("/")[1]
                    : "",
                };

                if (isTeacher) {
                  // Reset languages
                  const teacherLanguages =
                    userData?.teacher?.languages || userData?.languages || "";
                  const languagesArray = teacherLanguages
                    ? teacherLanguages.split(",").map((lang) => lang.trim())
                    : [];
                  setSelectedLanguages(languagesArray);

                  resetData.aboutMe =
                    userData?.teacher?.about_me || userData?.about_me || "";
                  resetData.aboutCourse =
                    userData?.teacher?.about_course ||
                    userData?.about_course ||
                    "";
                  resetData.video_link =
                    userData?.teacher?.video_link || userData?.video_link || "";
                  resetData.certificate =
                    userData?.teacher?.certificate ||
                    userData?.certificate ||
                    "";
                }

                reset(resetData);
                removeImagePreview();
              }}
              disabled={profileMutation.isPending}
            >
              Reset
            </Button>
            <Button type="submit" disabled={profileMutation.isPending}>
              {profileMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;

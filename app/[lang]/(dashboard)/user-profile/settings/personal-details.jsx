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
import { setUserData } from "@/lib/auth-utils";
import { useMutate } from "@/hooks/useMutate";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useUserData } from "../profile-layout";
import { Icon } from "@iconify/react";
import Image from "next/image";

const PersonalDetails = () => {
  const [date, setDate] = useState();
  const { userData, updateUserData, isLoading } = useUserData();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Profile update mutation
  const profileMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/profile/update",
    text: "Profile updated successfully",
    onSuccess: (data) => {
      if (data.status) {
        // Update user data in localStorage and context
        setUserData(data.data);
        updateUserData(data.data);
        // Clear image preview after successful update
        setImagePreview(null);
        setSelectedImage(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.msg || "Failed to update profile");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.msg || "Failed to update profile");
    },
  });

  // Load user data on component mount
  useEffect(() => {
    if (userData && !isLoading) {
      // Populate form with user data
      reset({
        name: userData.name || "",
        phoneNumber: userData.phone || "",
        email: userData.email || "",
        language: userData.language || "",
        country: userData.country || "",
        city: userData.city || "",
        aboutMe: userData.about_me || "",
        aboutCourse: userData.about_course || "",
      });

      // Set current image preview if user has an image
      if (userData.image) {
        setImagePreview(userData.image);
      }
    }
  }, [userData, isLoading, reset]);

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
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

    // Add form fields
    formData.append("name", data.name);
    formData.append("phone", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("language", data.language);
    formData.append("country", data.country);
    formData.append("city", data.city);
    formData.append("about_me", data.aboutMe);
    formData.append("about_course", data.aboutCourse);

    // Add image if selected
    if (selectedImage) {
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
                      className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
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
                  JPG, PNG or GIF. Max size 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
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
            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="language" className="mb-2">
                Language
              </Label>
              <Select
                value={watch("language")}
                onValueChange={(value) => setValue("language", value)}
                disabled={profileMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="bangla">Bangla</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <div className="col-span-12 lg:col-span-6">
              <Label htmlFor="aboutMe" className="mb-2">
                About Me
              </Label>
              <Textarea
                id="aboutMe"
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
                {...register("aboutCourse")}
                disabled={profileMutation.isPending}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                removeImagePreview();
              }}
              disabled={profileMutation.isPending}
            >
              Cancel
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

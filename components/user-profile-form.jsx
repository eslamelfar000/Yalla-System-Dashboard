"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { getUserData, setUserData, uploadProfileImage } from "@/lib/auth-utils";
import { useMutate } from "@/hooks/useMutate";

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
});

// Password update schema
const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const UserProfileForm = () => {
  const [userData, setUserDataState] = React.useState(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef(null);

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    mode: "all",
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "all",
  });

  // Profile update mutation
  const profileMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/profile/update",
    text: "Profile updated successfully",
    onSuccess: (data) => {
      if (data.status) {
        setUserData(data.data);
        setUserDataState(data.data);
      } else {
        toast.error(data.msg || "Failed to update profile");
      }
    },
  });

  // Password update mutation
  const passwordMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/profile/update-password",
    text: "Password updated successfully",
    onSuccess: (data) => {
      if (data.status) {
        passwordForm.reset();
      } else {
        toast.error(data.msg || "Failed to update password");
      }
    },
  });

  React.useEffect(() => {
    // Load user data and populate forms
    const user = getUserData();
    if (user) {
      setUserDataState(user);
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [profileForm]);

  const onProfileSubmit = (data) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    passwordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
      new_password_confirmation: data.confirm_password,
    });
  };

  const handleImageUpload = async (event) => {
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

    setIsUploadingImage(true);
    try {
      const result = await uploadProfileImage(file);
      if (result.success) {
        toast.success("Profile image updated successfully");
        setUserDataState(result.data.data);
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred while uploading image");
      console.error("Image upload error:", error);
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
          pathname.includes("/storage/") ||
          pathname.includes("/uploads/") ||
          pathname.includes("/images/"))
      );
    } catch {
      return false;
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasValidImage = isValidImageUrl(userData.image);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-default-900">User Profile</h1>
        <p className="text-default-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {hasValidImage ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon
                        icon="heroicons:user"
                        className="w-10 h-10 text-primary"
                      />
                    </div>
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">{userData.name}</h3>
                  <p className="text-sm text-default-600">{userData.email}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    <Icon icon="heroicons:camera" className="w-4 h-4 mr-2" />
                    Change Picture
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...profileForm.register("name")}
                      disabled={profileMutation.isPending}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      disabled={profileMutation.isPending}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                      disabled={profileMutation.isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...profileForm.register("location")}
                      disabled={profileMutation.isPending}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={profileMutation.isPending}>
                  {profileMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    {...passwordForm.register("current_password")}
                    disabled={passwordMutation.isPending}
                  />
                  {passwordForm.formState.errors.current_password && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.current_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    {...passwordForm.register("new_password")}
                    disabled={passwordMutation.isPending}
                  />
                  {passwordForm.formState.errors.new_password && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    {...passwordForm.register("confirm_password")}
                    disabled={passwordMutation.isPending}
                  />
                  {passwordForm.formState.errors.confirm_password && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileForm;

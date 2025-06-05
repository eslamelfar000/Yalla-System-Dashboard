"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";
import { useMutate } from "@/hooks/useMutate";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watch password fields for validation
  const newPassword = watch("newPassword");

  // Password update mutation
  const passwordMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/profile/update-password",
    text: "Password updated successfully",
    onSuccess: (data) => {
      reset(); // Clear form on success
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    const formattedData = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      new_password_confirmation: data.confirmPassword,
    };

    passwordMutation.mutate(formattedData);
  };

  // Password validation helper
  const validatePassword = (password) => {
    const requirements = [];
    if (password.length < 8) requirements.push("At least 8 characters");
    if (!/[a-z]/.test(password))
      requirements.push("At least one lowercase letter");
    if (!/[A-Z]/.test(password))
      requirements.push("At least one uppercase letter");
    if (!/\d/.test(password)) requirements.push("At least one number");
    return requirements;
  };

  return (
    <>
      <Card className="rounded-t-none pt-6">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
              <div className="col-span-12 md:col-span-6">
                <Label
                  htmlFor="currentPassword"
                  className="mb-2 text-default-800"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={currentPasswordType}
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                    disabled={passwordMutation.isPending}
                  />
                  <Eye
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer",
                      currentPasswordType === "text" && "hidden"
                    )}
                    onClick={() => setCurrentPasswordType("text")}
                  />
                  <EyeOff
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer",
                      currentPasswordType === "password" && "hidden"
                    )}
                    onClick={() => setCurrentPasswordType("password")}
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6"></div>
              <div className="col-span-12 md:col-span-6">
                <Label htmlFor="newPassword" className="mb-2 text-default-800">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={newPasswordType}
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    disabled={passwordMutation.isPending}
                  />
                  <Eye
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer",
                      newPasswordType === "text" && "hidden"
                    )}
                    onClick={() => setNewPasswordType("text")}
                  />
                  <EyeOff
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer",
                      newPasswordType === "password" && "hidden"
                    )}
                    onClick={() => setNewPasswordType("password")}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <Label
                  htmlFor="confirmPassword"
                  className="mb-2 text-default-800"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={confirmPasswordType}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    disabled={passwordMutation.isPending}
                  />
                  <Eye
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer",
                      confirmPasswordType === "text" && "hidden"
                    )}
                    onClick={() => setConfirmPasswordType("text")}
                  />
                  <EyeOff
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-default-500 w-4 h-4 cursor-pointer",
                      confirmPasswordType === "password" && "hidden"
                    )}
                    onClick={() => setConfirmPasswordType("password")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 text-sm font-medium text-default-800">
              Password Requirements:
            </div>
            <div className="mt-3 space-y-1.5">
              {[
                "Minimum 8 characters long - the more, the better.",
                "At least one lowercase character.",
                "At least one uppercase character.",
                "At least one number, symbol, or whitespace character.",
              ].map((item, index) => {
                let isValid = true;
                if (newPassword) {
                  switch (index) {
                    case 0:
                      isValid = newPassword.length >= 8;
                      break;
                    case 1:
                      isValid = /[a-z]/.test(newPassword);
                      break;
                    case 2:
                      isValid = /[A-Z]/.test(newPassword);
                      break;
                    case 3:
                      isValid = /[\d\W]/.test(newPassword);
                      break;
                  }
                }

                return (
                  <div
                    className="flex items-center gap-1.5"
                    key={`requirement-${index}`}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        newPassword
                          ? isValid
                            ? "bg-green-500"
                            : "bg-red-500"
                          : "bg-default-400"
                      )}
                    ></div>
                    <div
                      className={cn(
                        "text-xs",
                        newPassword
                          ? isValid
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-default-600"
                      )}
                    >
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-5 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => reset()}
                disabled={passwordMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={passwordMutation.isPending}>
                <Icon
                  icon="heroicons:lock-closed"
                  className="w-5 h-5 text-primary-foreground me-1"
                />
                {passwordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ChangePassword;

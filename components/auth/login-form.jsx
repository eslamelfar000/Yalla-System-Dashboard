"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SiteLogo } from "@/components/svg";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMutate } from "@/hooks/useMutate";
import {
  setAuthToken,
  setUserData,
  getDefaultRouteForRole,
} from "@/lib/auth-utils";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schema = z.object({
  login: z
    .string()
    .email({ message: "Your email is invalid." })
    .or(z.string().min(10, { message: "Your number is invalid." })),
  password: z.string().min(4),
});

const LogInForm = () => {
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";
  const { login: authLogin } = useAuth();

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "text" ? "password" : "text"));
  };

  const [type, setType] = React.useState("admin");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      login: "super@admin.com",
      password: "Eslam@000",
    },
  });

  useEffect(() => {
    setValue(
      "login",
      type === "admin"
        ? "super@admin.com"
        : type === "teacher"
        ? "eslam5saber707@gmail.com	"
        : "eslamsaber708@gmail.com"
    );

    setValue(
      "password",
      type === "admin"
        ? "Eslam@000"
        : type === "teacher"
        ? "Eslam@555"
        : "Eslam@555"
    );
  }, [type, setValue]);

  const loginMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/login",
    text: "Login Successful",
    onSuccess: (data) => {
      // Set token and user data in storage
      setAuthToken(data.token);
      setUserData(data.data);

      // Update auth context and redirect based on role
      authLogin(data.data, data.token);

      // Get default route for user role
      const defaultRoute = getDefaultRouteForRole(data.data.role);
      reset();

      // Router push with language prefix
      router.push(`/${lang}${defaultRoute}`);
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10">
      <Link href={`/${lang}/dashboard`} className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        Enter your credentials to access your account.
      </div>

      <div className="mt-5">
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="quality">Quality</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Email / Phone
          </Label>
          <Input
            disabled={loginMutation.isPending}
            {...register("login")}
            type="text"
            id="email"
            className={cn("", {
              "border-destructive": errors.login,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder="Enter your email or phone number"
          />
          {errors.login && (
            <div className="text-destructive mt-2">{errors.login.message}</div>
          )}
        </div>

        <div className="mt-3.5">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              disabled={loginMutation.isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer"
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder="Enter your password"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}
            >
              <Icon
                icon={
                  passwordType === "password"
                    ? "heroicons:eye"
                    : "heroicons:eye-slash"
                }
                className="w-5 h-5 text-default-400"
              />
            </div>
          </div>
          {errors.password && (
            <div className="text-destructive mt-2">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label htmlFor="remember" className="text-sm text-default-600">
              Remember me
            </Label>
          </div>
          <Link
            href={`/${lang}/auth/forgot`}
            className="text-sm text-primary hover:text-primary/80"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className="w-full mt-5"
          disabled={loginMutation.isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {loginMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-default-600">
          Don't have an account?{" "}
          <Link
            href={`/${lang}/auth/register`}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInForm;

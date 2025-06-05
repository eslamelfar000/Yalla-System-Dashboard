"use client";
import React from "react";
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
import { setAuthToken, setUserData } from "@/lib/auth-utils";
import { useRouter, useParams } from "next/navigation";

const schema = z.object({
  login: z.string().email({ message: "Your email is invalid." }),
  password: z.string().min(4),
});

const LogInForm = () => {
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "text" ? "password" : "text"));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      login: "super@admin.com",
      password: "123456789",
    },
  });

  const loginMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/login",
    text: "Login Successful",
    onSuccess: (data) => {
      setAuthToken(data.token);
      setUserData(data.data);
      reset();
      router.push(`/${lang}/dashboard`);
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
        Enter the information you entered while registering.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Email
          </Label>
          <Input
            disabled={loginMutation.isPending}
            {...register("login")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.login,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
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
              placeholder=" "
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

        <Button
          className="w-full mt-5"
          disabled={loginMutation.isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {loginMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {loginMutation.isPending ? "Loading..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;

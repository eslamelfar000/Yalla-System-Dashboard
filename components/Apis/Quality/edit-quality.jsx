"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Slider } from "@/components/ui/slider";
import { useUpdateUser } from "@/hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/Shared/loading-button";
import { useAxios } from "@/config/axios.config";

function EditQualityComponent({ user, info }) {
  // API hook for updating quality user
  const { mutate: updateQuality, isPending: isUpdating } = useUpdateUser(
    user?.id,
    "quality"
  );

  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  const [isNew, setIsNew] = useState(user?.is_new || false);

  // Handle is_new request
  const handleIsNewRequest = async () => {
    try {
      await axiosInstance.post(
        `dashboard/users/${user?.user_id}/change-is-new`
      );
      setIsNew(!isNew); // Only update state after successful request
      queryClient.invalidateQueries(["users", "quality"]);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Is new request error:", error);
      toast.error(error?.response?.data?.msg || "Failed to update status");
    }
  };

  const formSchema = z.object({
    name: z.string().min(5, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z
      .string()
      .min(11, {
        message: "Please enter a valid phone number.",
      })
      .regex(/^\d+$/, {
        message: "Phone number must contain only digits.",
      }),
    debt: z.coerce.number().min(0, {
      message: "Debt must be a positive number.",
    }),
    review_lesson_price: z.coerce.number().min(1, {
      message: "Review lesson price must be a positive number.",
    }),
    coaching_lesson_price: z.coerce.number().min(1, {
      message: "Coaching lesson price must be a positive number.",
    }),
    status: z.enum(["active", "no_active"], {
      message: "Please select a status.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      debt: 0,
      review_lesson_price: "",
      coaching_lesson_price: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    const dummyData = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      debt: user?.debt || 0,
      review_lesson_price: user?.review_lesson_price || 0,
      coaching_lesson_price: user?.coaching_lesson_price || 0,
      status: user?.status || "active",
    };

    form.reset(dummyData);
  }, [user]);

  const onSubmit = async (data) => {
    // Add role to the data
    const qualityData = {
      ...data,
      role: "quality",
    };

    updateQuality(qualityData);
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      {...field}
                      autoFocus
                      readOnly={info}
                      className={info ? "cursor-pointer select-none" : ""}
                    />
                    {/* autoFocus here */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email address"
                      {...field}
                      readOnly={info}
                      className={info ? "cursor-pointer select-none" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="phone number"
                      {...field}
                      readOnly={info}
                      className={info ? "cursor-pointer select-none" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={info}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={
                          field.value === "no_active"
                            ? "text-red-700"
                            : "text-green-700"
                        }
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[999]">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="no_active">Not Active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review_lesson_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Lesson Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="review lesson price"
                      {...field}
                      readOnly={info}
                      className={info ? "cursor-pointer select-none" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coaching_lesson_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coaching Lesson Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="coaching lesson price"
                      {...field}
                      readOnly={info}
                      className={info ? "cursor-pointer select-none" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="debt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="debt"
                      {...field}
                      type="number"
                      readOnly={info}
                      className={info ? "cursor-pointer select-none" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!info && (
            <div className="flex justify-center gap-4">
              <Button
                type="submit"
                className="w-full md:w-[50%]"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <LoadingButton loading={isUpdating}>Saving...</LoadingButton>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

export default EditQualityComponent;

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
import { Icon } from "@iconify/react";
import { useUpdateUser } from "@/hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/Shared/loading-button";
import { useAxios } from "@/config/axios.config";
import { toast } from "react-hot-toast";
import { useState } from "react";

function EditTeacherComponent({ user, info }) {
  // API hook for updating teacher
  const { mutate: updateTeacher, isPending: isUpdating } = useUpdateUser(
    user?.user_id,
    "teacher"
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
      queryClient.invalidateQueries({ queryKey: ["users", "teacher"] });
      toast.success("Status updated successfully");
    } catch (error) {
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
    target: z.coerce.number().min(1).max(100, {
      message: "Target must be between 1 and 100.",
    }),
    debt: z.coerce.number().min(0, {
      message: "Debt must be a positive number.",
    }),
    trail_lesson_price: z.coerce.number().min(1, {
      message: "Trail lesson price must be a positive number.",
    }),
    payAfter_lesson_price: z.coerce.number().min(1, {
      message: "Subscriber lesson price must be a positive number.",
    }),
    payBefore_lesson_price: z.coerce.number().min(1, {
      message: "Subscriber lesson price must be a positive number.",
    }),
    package_after_price: z.coerce.number().min(1, {
      message: "Package lesson price must be a positive number.",
    }),
    package_before_price: z.coerce.number().min(1, {
      message: "Package lesson price must be a positive number.",
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
      target: 0,
      debt: 0,
      trail_lesson_price: 0,
      payAfter_lesson_price: 0,
      payBefore_lesson_price: 0,
      package_after_price: 0,
      package_before_price: 0,
      status: "active",
    },
  });

  React.useEffect(() => {
    const dummyData = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      target: user?.target || 0,
      debt: user?.debt || 0,
      trail_lesson_price: user?.trail_lesson_price || 0,
      payAfter_lesson_price: user?.payAfter_lesson_price || 0,
      payBefore_lesson_price: user?.payBefore_lesson_price || 0,
      package_after_price: user?.package_after_price || 0,
      package_before_price: user?.package_before_price || 0,
      status: user?.status || "active",
    };

    form.reset(dummyData);
  }, [user]);

  const onSubmit = async (data) => {
    // Add role to the data
    const teacherData = {
      ...data,
      role: "teacher",
    };

    updateTeacher(teacherData, {
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["users", "teacher"] });
      },
    });
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="target"
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
            <FormField
              control={form.control}
              name="trail_lesson_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trail Lesson Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="trail lesson price"
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
              name="payAfter_lesson_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay After Lesson Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="pay after lesson price"
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
              name="payBefore_lesson_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Before Lesson Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="pay before lesson price"
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
              name="package_after_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package / After Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="package after price"
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
              name="package_before_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package / Before Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="package before price"
                      {...field}
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

export default EditTeacherComponent;

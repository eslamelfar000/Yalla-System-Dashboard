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
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useCreateUser } from "@/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";

function AddQualityComponent() {
  const [show, setShow] = useState(false);
  const strongPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

  // API hook for creating quality user
  const { mutate: createQuality, isPending } = useCreateUser("quality");

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
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(strongPattern, {
        message:
          "Password must include an uppercase letter, a number, and a special character.",
      }),
    debt: z.coerce.number().min(0, {
      message: "Debt must be a positive number.",
    }),
    review_lesson_price: z.coerce.number().min(1, {
      message: "Trail lesson price must be a positive number.",
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
      password: "",
      debt: 0,
      review_lesson_price: 0,
      coaching_lesson_price: 0,
      status: "active",
    },
  });

  const onSubmit = async (data) => {
    // Add role to the data
    const qualityData = {
      ...data,
      role: "quality",
    };

    createQuality(qualityData);
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
                    <Input placeholder="name" {...field} autoFocus />
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
                    <Input placeholder="email address" {...field} />
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
                    <Input placeholder="phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type={`${show ? "text " : "password"}`}
                      {...field}
                    />
                  </FormControl>
                  {show ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className=" h-7 w-7 absolute right-1 top-6"
                      color="primary"
                      title="Show"
                      type="button"
                      onClick={() => setShow(!show)}
                    >
                      <Icon icon="heroicons:eye-slash" className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className=" h-7 w-7 absolute right-1 top-6"
                      color="primary"
                      title="Show"
                      type="button"
                      onClick={() => setShow(!show)}
                    >
                      <Icon icon="heroicons:eye" className="h-4 w-4" />
                    </Button>
                  )}

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
                    defaultValue={field.value}
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
                      <SelectItem value="no_active">No Active</SelectItem>
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
                    <Input placeholder="debt" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full md:w-[50%]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Icon
                    icon="svg-spinners:180-ring"
                    className="h-4 w-4 animate-spin mr-2"
                  />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddQualityComponent;

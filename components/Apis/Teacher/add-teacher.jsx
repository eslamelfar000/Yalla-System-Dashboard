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
import { useCreateUser } from "@/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";

function AddTeacherComponent() {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const strongPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;


  // API hook for creating teacher
  const { mutate: createTeacher, isPending } = useCreateUser("teacher");

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
      password: "",
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

  const onSubmit = async (data) => {
    // Add role to the data
    const teacherData = {
      ...data,
      role: "teacher",
    };

    createTeacher(teacherData, {
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
            {/** Numeric fields */}
            {[
              { name: "target", label: "Target" },
              { name: "debt", label: "Debt" },
              { name: "trail_lesson_price", label: "Trial Lesson Price" },
              {
                name: "payAfter_lesson_price",
                label: "Pay After Lesson Price",
              },
              {
                name: "payBefore_lesson_price",
                label: "Pay Before Lesson Price",
              },
              { name: "package_after_price", label: "Package After Price" },
              { name: "package_before_price", label: "Package Before Price" },
            ].map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="cover flex justify-center">
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
                  />{" "}
                  Creating...
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

export default AddTeacherComponent;

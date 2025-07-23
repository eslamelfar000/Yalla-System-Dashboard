"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icon } from "@iconify/react";
import { useMutate } from "@/hooks/useMutate";
import LoadingButton from "@/components/Shared/loading-button";

// Zod schema for salary adjustment form
const salaryAdjustmentSchema = z.object({
  type: z.enum(["raise", "reduction"], {
    required_error: "Please select a type",
  }),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be a positive number"
    ),
  reason: z.string().min(1, "Reason is required"),
});

const SalaryAdjustmentPopover = ({ teacherId, lessonId, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(salaryAdjustmentSchema),
    defaultValues: {
      type: "",
      amount: "",
      reason: "",
    },
  });

  // Mutation for adding salary adjustment
  const addAdjustmentMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/teacher-financial/${teacherId}/user-payments`,
    queryKeysToInvalidate: ["teacher-income"],
    text: "Salary adjustment added successfully!",
    onSuccess: (data) => {
      if (data.status) {
        form.reset();
        setIsOpen(false);
        onSuccess?.();
      }
    },
    onError: (error) => {
      console.error("Salary adjustment error:", error);
    },
  });

  const onSubmit = (values) => {
    const payload = {
      //   teacher_id: teacherId,
      schedual_lession_id: lessonId,
      type: values.type,
      amount: values.amount,
      note: values.reason,
    };

    addAdjustmentMutation.mutate(payload);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          color="primary"
        >
          <Icon icon="heroicons:plus" className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                Add Salary Adjustment
              </h4>
              <p className="text-sm text-muted-foreground">
                Set the Salary Adjustment for the teacher.
              </p>
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue="select type"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue="select type"
                          placeholder="Select Type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="z-[999]"
                      defaultValue="select type"
                    >
                      <SelectItem value="select type" disabled>
                        Select Type
                      </SelectItem>
                      <SelectItem value="reduction">Deduction</SelectItem>
                      <SelectItem value="raise">Raise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your reason here."
                      className="h-14"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              loading={addAdjustmentMutation.isPending}
              disabled={addAdjustmentMutation.isPending}
              className="w-full h-10"
            >
              Submit
            </LoadingButton>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default SalaryAdjustmentPopover;

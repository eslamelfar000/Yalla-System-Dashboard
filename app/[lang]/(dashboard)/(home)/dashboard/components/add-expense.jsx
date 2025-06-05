"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMutate } from "@/hooks/useMutate";
import { Icon } from "@iconify/react";

const schema = z.object({
  money: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid amount greater than 0",
    }),
  reason: z
    .string()
    .min(3, "Reason must be at least 3 characters")
    .max(500, "Reason must be less than 500 characters"),
});

const AddExpenseComponent = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const expenseMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/expenses",
    text: "Expense added successfully!",
    onSuccess: (data) => {
      if (data.status) {
        reset();
        if (onSuccess) onSuccess(data);
      } else {
        toast.error(data.msg || "Failed to add expense");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.msg || "Failed to add expense");
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      amount: parseFloat(data.money),
      reason: data.reason,
      date: new Date().toISOString(),
    };

    expenseMutation.mutate(formattedData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 bg-red-100 rounded-lg">
          <Icon icon="heroicons:banknotes" className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-default-900">
            Add New Expense
          </h3>
          <p className="text-sm text-default-600">
            Record a new expense with amount and reason
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="money"
            className="text-sm font-medium text-default-700"
          >
            Amount *
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-default-500">
              $
            </div>
            <Input
              id="money"
              {...register("money")}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-8"
              disabled={expenseMutation.isPending}
            />
          </div>
          {errors.money && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Icon icon="heroicons:exclamation-circle" className="w-4 h-4" />
              {errors.money.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="reason"
            className="text-sm font-medium text-default-700"
          >
            Reason *
          </Label>
          <Textarea
            id="reason"
            {...register("reason")}
            placeholder="Enter the reason for this expense..."
            rows={4}
            disabled={expenseMutation.isPending}
            className="resize-none"
          />
          {errors.reason && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <Icon icon="heroicons:exclamation-circle" className="w-4 h-4" />
              {errors.reason.message}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-default-600">
            <Icon icon="heroicons:information-circle" className="w-4 h-4" />
            <span>
              This expense will be recorded with today's date automatically.
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => reset()}
            disabled={expenseMutation.isPending}
          >
            <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={expenseMutation.isPending}
          >
            {expenseMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Icon icon="heroicons:plus" className="w-4 h-4 mr-2" />
                Add Expense
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseComponent;

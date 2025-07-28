"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const ShowExpenseDialog = ({
  expense,
  open,
  onOpenChange,
  onDelete,
  isDeleting,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon
                icon="heroicons:banknotes"
                className="w-5 h-5 text-green-600"
              />
              Expense Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this expense
            </DialogDescription>
          </DialogHeader>

          {expense ? (
            <div className="space-y-4">
              {/* Amount */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">
                    Amount
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Note
                </label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-800">{expense.note}</p>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="heroicons:calendar" className="w-4 h-4" />
                  <span>{formatDate(expense.created_at || expense.date)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Close
                </Button>
                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(expense.id)}
                    className="flex-1"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Icon
                          icon="heroicons:arrow-path"
                          className="w-4 h-4 mr-2 animate-spin"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Icon icon="heroicons:trash" className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Icon
                icon="heroicons:document-text"
                className="w-8 h-8 text-gray-400 mx-auto mb-2"
              />
              <p className="text-sm text-gray-600">No expense details found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowExpenseDialog;

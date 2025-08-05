import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { data } from "./data";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useGetData } from "@/hooks/useGetData";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ShowExpenseDialog from "./show-expense-dialog";
import { useMutate } from "@/hooks/useMutate";
import toast from "react-hot-toast";
import { useAxios } from "@/config/axios.config";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { SharedAlertDialog } from "@/components/Shared/Drawer/shared-dialog";

const NotesTable = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useGetData({
    endpoint: "dashboard/expenses",
    queryKey: ["expenses"],
    // queryFn: () => getNotes(),
  });

  const expenses = data?.data;

  // Delete expense mutation
  const deleteExpenseMutation = useMutate({
    method: "GET",
    endpoint: "dashboard/expense",
    queryKeysToInvalidate: ["expenses"],
    text: "Expense deleted successfully!",
    onSuccess: () => {
      setShowDialog(false);
      setSelectedExpense(null);
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.msg || "Failed to delete expense");
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
    },
  });

  const handleShowExpense = (expense) => {
    setSelectedExpense(expense);
    setShowDialog(true);
  };

  const handleDeleteClick = (expenseId) => {
    setExpenseToDelete({ id: expenseId });
    setShowDeleteConfirm(true);
  };

  const handleDeleteExpense = (expenseId) => {
    // Use axios directly to include ID in URL
    axiosInstance({
      method: "GET",
      url: `dashboard/expense/${expenseId}`,
    })
      .then((response) => {
        // Invalidate queries
        queryClient.invalidateQueries(["expenses"]);

        // Show success message
        toast.success("Expense deleted successfully!");

        // Reset states
        setShowDialog(false);
        setSelectedExpense(null);
        setShowDeleteConfirm(false);
        setExpenseToDelete(null);
        refetch();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg || "Failed to delete expense");
        setShowDeleteConfirm(false);
        setExpenseToDelete(null);
      });
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      handleDeleteExpense(expenseToDelete.id);
    }
  };

  const columns = [
    {
      key: "money",
      label: "Amount",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={column.key}
                // className={`last:text-right`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column, index) => (
                  <TableCell key={column.key} className="text-center">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : expenses?.length > 0 ? (
            expenses?.map((item) => (
              <TableRow key={item.id} className="hover:bg-default-100">
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(item?.amount)}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={item.note}>
                    {item.note}
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className=" h-7 w-7"
                      color="success"
                      title="Show"
                      onClick={() => handleShowExpense(item)}
                    >
                      <Icon icon="heroicons:eye" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      color="destructive"
                      className="h-7 w-7"
                      title="Delete Expense"
                      onClick={() => handleDeleteClick(item.id)}
                      disabled={deleteExpenseMutation.isPending}
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <p className="text-primary bg-primary-500/10 rounded-md p-2">
                  No expenses found
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Show Expense Dialog */}
      <ShowExpenseDialog
        expense={selectedExpense}
        open={showDialog}
        onOpenChange={setShowDialog}
        onDelete={handleDeleteExpense}
        isDeleting={deleteExpenseMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteExpenseMutation.isPending}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteExpenseMutation.isPending}
            >
              {deleteExpenseMutation.isPending ? (
                <>
                  <Icon
                    icon="heroicons:arrow-path"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotesTable;

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Check } from "lucide-react";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
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
import LoadingButton from "@/components/Shared/loading-button";

const CoachingTableStatus = ({ action }) => {
  const [selectedCoaching, setSelectedCoaching] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch coaching data from API
  const {
    data: coachingData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: "dashboard/coaching",
    queryKey: ["coaching"],
  });

  const coachingList = coachingData?.data || [];

  // Mutation for completing coaching
  const completeCoachingMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/coaching/${selectedCoaching?.id}/complete`,
    queryKeysToInvalidate: [["coaching"]],
    text: "Coaching completed successfully!",
    onSuccess: () => {
      setShowConfirmDialog(false);
      setSelectedCoaching(null);
      refetch();
    },
  });

  const columns = [
    {
      key: "session",
      label: "Session",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "purpose",
      label: "Purpose",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: coachingList,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleCompleteCoaching = (coaching) => {
    setSelectedCoaching(coaching);
    setShowConfirmDialog(true);
  };

  const handleConfirmComplete = async () => {
    if (selectedCoaching) {
      await completeCoachingMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Icon
              icon="eos-icons:loading"
              className="w-8 h-8 animate-spin mx-auto mb-2"
            />
            <p>Loading coaching data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Icon
              icon="material-symbols:error-outline"
              className="w-8 h-8 text-red-500 mx-auto mb-2"
            />
            <p className="text-red-500">Error loading coaching data</p>
            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-right!">
                  {" "}
                  {column?.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {coachingList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No coaching data available
                </TableCell>
              </TableRow>
            ) : (
              coachingList.map((item) => (
                <TableRow key={item.id} className="hover:bg-default-100">
                  <TableCell>{item.session || item.id}</TableCell>
                  <TableCell>{item.date || "N/A"}</TableCell>
                  <TableCell>{item.purpose || "N/A"}</TableCell>
                  {action === "board" ? (
                    <TableCell>
                      <Button
                        className="px-5 text-xs h-8 rounded-full"
                        color="primary"
                        onClick={() => handleCompleteCoaching(item)}
                        disabled={item.status === "completed"}
                      >
                        {item.status === "completed" ? "Completed" : "Done"}
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Toggle
                        aria-label="Toggle italic"
                        size="icon"
                        className="w-6 h-6 p-1 rounded-full bg-transparent text-primary border border-solid border-primary"
                        pressed={item.status === "completed"}
                      >
                        <Check className="w-6 h-6" />
                      </Toggle>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center flex-wrap gap-4 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2  items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>

          {table.getPageOptions().map((page, pageIdx) => (
            <Button
              key={`basic-data-table-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={`${
                pageIdx === table.getState().pagination.pageIndex
                  ? ""
                  : "outline"
              }`}
              className={cn("w-8 h-8")}
            >
              {page + 1}
            </Button>
          ))}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Coaching Completion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this coaching session as completed?
              <br />
              <strong>Session:</strong>{" "}
              {selectedCoaching?.session || selectedCoaching?.id}
              <br />
              <strong>Date:</strong> {selectedCoaching?.date || "N/A"}
              <br />
              <strong>Purpose:</strong> {selectedCoaching?.purpose || "N/A"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={completeCoachingMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              loading={completeCoachingMutation.isPending}
              onClick={handleConfirmComplete}
              variant="default"
            >
              Complete Coaching
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoachingTableStatus;

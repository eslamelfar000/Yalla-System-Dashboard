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
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import { useAuth } from "@/hooks/use-auth";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadingButton from "@/components/Shared/loading-button";

const CoachingTableStatus = ({ selectedTeacher }) => {
  const [selectedCoaching, setSelectedCoaching] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch coaching data from API with teacher filter
  const {
    data: coachingData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: selectedTeacher
      ? `dashboard/coaching?teacher_id=${selectedTeacher}`
      : "dashboard/coaching",
    queryKey: ["coaching", selectedTeacher],
  });

  const coachingList = coachingData?.data || [];

  // Mutation for completing coaching
  const completeCoachingMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/status-report/${selectedCoaching?.id}`,
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
        <TableSkeleton columns={columns} rows={3} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading coaching data</p>
            <Button onClick={() => refetch()}>Retry</Button>
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
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {coachingList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  {selectedTeacher
                    ? "No coaching sessions found for the selected teacher"
                    : "Please select a teacher to view coaching sessions"}
                </TableCell>
              </TableRow>
            ) : (
              coachingList.map((coaching) => (
                <TableRow key={coaching.id} className="hover:bg-default-100">
                  <TableCell className="font-medium">
                    {coaching.teacher?.name || coaching.id}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      coaching.date || coaching.created_at
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{coaching.purpose || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteCoaching(coaching)}
                      disabled={coaching.completed}
                    >
                      <Icon icon="heroicons:check" className="w-4 h-4 mr-1" />
                      {coaching.completed ? "Completed" : "Mark Done"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center flex-wrap gap-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2 items-center">
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
            <AlertDialogTitle>Complete Coaching Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this coaching session as completed?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              onClick={handleConfirmComplete}
              loading={completeCoachingMutation.isPending}
            >
              Complete
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoachingTableStatus;

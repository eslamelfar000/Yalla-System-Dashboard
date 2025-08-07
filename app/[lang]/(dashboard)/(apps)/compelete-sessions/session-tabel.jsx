"use client";
import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import { useDebounce } from "@/hooks/use-debounce";
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
import Pagination from "@/components/Shared/Pagination/Pagination";

const columns = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage src={row?.original?.student?.image} />
            <AvatarFallback>
              {row?.original?.student?.name?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-card-foreground whitespace-nowrap">
            {row?.original?.student?.name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-gray-600">
            {row?.original?.student?.id || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "booked",
    header: "Booked",
    cell: ({ row }) => (
      <div className="text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-gray-600">
            {row?.original?.student?.sessions_count > 1
              ? row?.original?.student?.sessions_count + " sessions"
              : row?.original?.student?.sessions_count + " session"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-gray-600 capitalize">
            {row?.original?.type || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (
      <div className="text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Badge
            variant={row?.original?.payment_type ? "default" : "secondary"}
            className={cn(
              row?.original?.payment_type
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {row?.original?.payment_type || "N/A"}
          </Badge>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "teacher_phone",
    header: "Teacher Phone",
    cell: ({ row }) => (
      <div className="text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-gray-600">
            {row?.original?.teacher?.phone || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          {row?.original?.accept === "done" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-green-500"
            >
              <path
                fillRule="evenodd"
                d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          ) : row?.original?.status !== "pending" ? (
            <Icon icon="heroicons:clock" className="w-8 h-8 text-yellow-500" />
          ) : (
            <Button
              className="px-5 text-xs rounded-full h-8"
              color="primary"
              onClick={() =>
                row.original.onActionClick &&
                row.original.onActionClick(row.original)
              }
              disabled={row?.original?.completed}
            >
              Done
            </Button>
          )}
        </div>
      </div>
    ),
  },
];

export function SessionsDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Local state for search input
  const [localSearchValue, setLocalSearchValue] = useState("");

  // Debounce the search value to avoid excessive API calls
  const debouncedSearchValue = useDebounce(localSearchValue, 500);

  // Build endpoint with search and teacher filter
  const buildEndpoint = useMemo(() => {
    let endpoint = `dashboard/complete-sessions?page=${currentPage}`;
    const params = [];

    if (selectedTeacher) {
      params.push(`&teacher_id=${selectedTeacher}`);
    }

    if (debouncedSearchValue) {
      params.push(`&search=${encodeURIComponent(debouncedSearchValue)}`);
    }

    if (params.length > 0) {
      endpoint += `${params.join("&")}`;
    }

    return endpoint;
  }, [selectedTeacher, debouncedSearchValue, currentPage]);

  // Get complete sessions data with search and teacher filter
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useGetData({
    endpoint: buildEndpoint,
    queryKey: [
      "complete-sessions",
      selectedTeacher,
      debouncedSearchValue,
      currentPage,
    ],
  });

  const sessions = sessionsData?.data?.sessions || [];

  // Complete session mutation
  const completeSessionMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/complete-session-admin/${selectedSession?.id}`,
    queryKeysToInvalidate: [["complete-sessions"]],
    text: "Session completed successfully!",
    onSuccess: () => {
      setShowConfirmDialog(false);
      setSelectedSession(null);
      refetchSessions();
    },
  });

  // Memoize action click handler to prevent recreation on every render
  const handleActionClick = useCallback((sessionData) => {
    setSelectedSession(sessionData);
    setShowConfirmDialog(true);
  }, []);

  // Memoize sessions with actions to prevent unnecessary re-renders
  const sessionsWithActions = useMemo(() => {
    return sessions.map((session) => ({
      ...session,
      onActionClick: handleActionClick,
    }));
  }, [sessions, handleActionClick]);

  const table = useReactTable({
    data: sessionsWithActions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Memoize handlers to prevent recreation
  const handleConfirmComplete = useCallback(() => {
    if (selectedSession) {
      completeSessionMutation.mutate();
    }
  }, [selectedSession, completeSessionMutation]);

  const handleTeacherChange = useCallback((teacherId) => {
    setSelectedTeacher(teacherId);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedTeacher("");
  }, []);

  const handleSearchChange = useCallback((value) => {
    setLocalSearchValue(value);
  }, []);

  const handleRetry = useCallback(() => {
    refetchSessions();
  }, [refetchSessions]);

  // Loading skeleton
  if (sessionsLoading) {
    return (
      <>
        <div className="flex items-center flex-wrap gap-4 mb-5">
          <Input
            placeholder="Search by student name..."
            value={localSearchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-sm min-w-[200px] h-10"
          />
          <TeacherFilter
            selectedTeacher={selectedTeacher}
            onTeacherChange={handleTeacherChange}
            onClearFilter={handleClearFilter}
          />
        </div>
        <Card>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex items-center flex-wrap gap-4 px-4 py-4">
          <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
            Loading...
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (sessionsError) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-red-500">
            Error loading sessions:{" "}
            {sessionsError?.message || "Something went wrong"}
          </p>
          <Button onClick={handleRetry} className="mt-4" variant="outline">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center flex-wrap gap-4 mb-5">
        <Input
          placeholder="Search by student name..."
          value={localSearchValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="max-w-sm min-w-[200px] h-10"
        />
        {!sessionsError && (
          <TeacherFilter
            selectedTeacher={selectedTeacher}
            onTeacherChange={handleTeacherChange}
            onClearFilter={handleClearFilter}
          />
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-default-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={sessionsData?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this session as complete?
              <br />
              <strong>Student:</strong>{" "}
              <span className="capitalize">
                {selectedSession?.student?.name || "N/A"}
              </span>
              <br />
              <strong>Session ID:</strong>{" "}
              <span className="capitalize">{selectedSession?.id || "N/A"}</span>
              <br />
              <strong>Type:</strong>{" "}
              <span className="capitalize">
                {selectedSession?.type || "N/A"}
              </span>
              <br />
              <strong>Booked:</strong>{" "}
              <span className="capitalize">
                {selectedSession?.student?.sessions_count > 1
                  ? selectedSession?.student?.sessions_count + " sessions"
                  : selectedSession?.student?.sessions_count + " session"}
              </span>
              <br />
              <br />
              <span className="text-orange-600 font-medium">
                ⚠️ This action cannot be undone once completed.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={completeSessionMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              loading={completeSessionMutation.isPending}
              onClick={handleConfirmComplete}
              variant="default"
            >
              Complete Session
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SessionsDataTable;

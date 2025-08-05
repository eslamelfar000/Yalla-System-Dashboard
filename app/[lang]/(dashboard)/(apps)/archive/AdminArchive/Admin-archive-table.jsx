"use client";
import { Fragment, useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/useGetData";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import { SharedSheet } from "@/components/Shared/Drawer/shared-sheet";
import DownloadButton from "@/components/Shared/DownloadButton";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "@/components/Shared/Pagination/Pagination";

const AdminArchiveTable = ({ role }) => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    types: [],
    sessions: [],
    months: [],
    year: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  // ........

  // Debounce search query to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedTeacher && role === "admin") {
      params.append("teacher_id", selectedTeacher);
    }

    if (debouncedSearchQuery) {
      params.append("name", debouncedSearchQuery);
    }

    if (filters.types.length > 0) {
      params.append("types", filters.types.join(","));
    }

    if (filters.sessions.length > 0) {
      params.append("count", filters.sessions.join(","));
    }

    if (filters.year && filters.months.length > 0) {
      const formattedMonths = filters.months.map(month => `${filters.year}-${month}`).join(",");
      params.append("months", formattedMonths);
    }

    return params.toString();
  }, [selectedTeacher, debouncedSearchQuery, filters]);

  // Get archive data with filters
  const {
    data: archiveData,
    isLoading: archiveLoading,
    error: archiveError,
    refetch: refetchArchive,
  } = useGetData({
    endpoint: `dashboard/complete-session-archive${
      buildQueryParams() ? `?${buildQueryParams()}&page=${currentPage}` : ""
    }`,
    queryKey: [
      "complete-session-archive",
      selectedTeacher,
      debouncedSearchQuery,
      filters,
    ],
  });

  const archiveList = archiveData?.data?.data || [];

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  // Prepare data for export
  const prepareExportData = useCallback(() => {
    return archiveList.map((item) => ({
      "Student Name": item.student?.name || "N/A",
      ...(role === "admin" && {
        "Student Phone": item.student?.phone || "N/A",
        "Student Email": item.student?.email || "N/A",
      }),
      "Student ID": item.student?.id || "N/A",
      "Teacher Name": item.teacher?.name || "N/A",
      "Teacher Email": item.teacher?.email || "N/A",
      Type: item.type || "N/A",
      "Sessions Count": item.count || 0,
      Price: item.price || "N/A",
      "Payment Type": item.payment_type || "N/A",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
      "Request ID": item.id || "N/A",
    }));
  }, [archiveList]);

  const columns = [
    {
      key: "student",
      label: "Student Name",
    },
    {
      key: "id",
      label: "ID",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "count",
      label: "Booked",
    },
    ...(role === "teacher"
      ? [
          {
            key: "date",
            label: "Date",
          },
        ]
      : []),
    ...(role === "admin"
      ? [
          {
            key: "teacher",
            label: "Teacher",
          },
          {
            key: "action",
            label: "Action",
          },
        ]
      : []),
  ];

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: archiveList,
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

  // Memoized handlers
  const handleTeacherChange = useCallback((teacherId) => {
    setSelectedTeacher(teacherId);
  }, []);

  const handleClearTeacherFilter = useCallback(() => {
    setSelectedTeacher("");
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleFilterApply = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({
      types: [],
      sessions: [],
      months: [],
      year: "",
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTeacher("");
    setFilters({
      types: [],
      sessions: [],
      months: [],
      year: "",
    });
  }, []);

  const handleRetry = useCallback(() => {
    refetchArchive();
  }, [refetchArchive]);

  // Loading skeleton
  if (archiveLoading) {
    return (
      <>
        {/* Filters and Search */}
        <div className="space-y-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="max-w-sm min-w-[200px] h-10"
            />
            {role === "admin" && (
              <TeacherFilter
                selectedTeacher={selectedTeacher}
                onTeacherChange={handleTeacherChange}
                onClearFilter={handleClearTeacherFilter}
                clearButton={false}
              />
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SharedSheet
                type="filter-archive"
                onSuccess={handleFilterApply}
                onReset={handleFilterReset}
                initialFilters={filters}
              />
              {(searchQuery ||
                selectedTeacher ||
                Object.values(filters).some((arr) => arr.length > 0)) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllFilters}
                  className="h-10"
                >
                  <Icon icon="heroicons:x-mark" className="w-4 h-4 mr-1" />
                  Clear All Filters
                </Button>
              )}
            </div>
            <DownloadButton
              data={[]}
              prepareExportData={() => []}
              fileName="archive-data"
              disabled={true}
            />
          </div>
        </div>

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
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-3 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-3 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-7 w-7 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center flex-wrap gap-4 px-4 py-4">
          <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex gap-2 items-center">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (archiveError) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading archive data</p>
            <Button onClick={handleRetry}>Retry</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Filters and Search */}
      <div className="space-y-6 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <Input
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-sm min-w-[200px] h-10"
          />
          {role === "admin" && (
            <TeacherFilter
              selectedTeacher={selectedTeacher}
              onTeacherChange={handleTeacherChange}
              onClearFilter={handleClearTeacherFilter}
              clearButton={false}
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SharedSheet
              type="filter-archive"
              onSuccess={handleFilterApply}
              onReset={handleFilterReset}
              initialFilters={filters}
            />
            {(searchQuery ||
              selectedTeacher ||
              Object.values(filters).some((arr) => arr.length > 0)) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllFilters}
                className="h-10"
              >
                <Icon icon="heroicons:x-mark" className="w-4 h-4 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
          <DownloadButton
            data={archiveList}
            prepareExportData={prepareExportData}
            fileName="archive-data"
            disabled={archiveLoading}
          />
        </div>
      </div>

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
            {archiveList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  {selectedTeacher ||
                  searchQuery ||
                  Object.values(filters).some((arr) => arr.length > 0)
                    ? "No archive records found for the selected filters"
                    : "No archive records found"}
                </TableCell>
              </TableRow>
            ) : (
              archiveList.map((item) => (
                <Fragment key={item.id}>
                  <TableRow
                    onClick={() => (role === "admin" ? toggleRow(item.id) : "")}
                    className={`cursor-pointer select-none hover:bg-default-100 ${
                      collapsedRows.includes(item.id) ? "bg-default-100" : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-3 items-center">
                          <Avatar className="rounded-full">
                            <AvatarImage
                              src={item.student?.image || item.student?.avatar}
                            />
                            <AvatarFallback>
                              {item.student?.name?.charAt(0) || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm block text-card-foreground">
                              {item.student?.name || "N/A"}
                            </span>
                            <span className="text-xs mt-1 block font-normal text-muted-foreground">
                              {(role === "admin" && item.student?.email) || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant="soft"
                        color={
                          item.type === "trail"
                            ? "success"
                            : item.type === "payafter"
                            ? "warning"
                            : "default"
                        }
                        className="capitalize rounded-md"
                      >
                        {item.type || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.count > 1
                        ? item.count + " Sessions"
                        : item.count + " Session"}
                    </TableCell>
                    {role === "teacher" && (
                      <TableCell>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    )}
                    {role === "admin" && (
                      <>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-3 items-center">
                              <Avatar className="rounded-full">
                                <AvatarImage
                                  src={
                                    item.teacher?.image || item.teacher?.avatar
                                  }
                                />
                                <AvatarFallback>
                                  {item.teacher?.name?.charAt(0) || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm block text-card-foreground">
                                  {item.teacher?.name || "N/A"}
                                </span>
                                <span className="text-xs mt-1 block font-normal text-muted-foreground">
                                  {item.teacher?.email || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="">
                          <Button
                            size="icon"
                            variant="outline"
                            color="secondary"
                            className="h-7 w-7 border-none rounded-full"
                          >
                            <Icon
                              icon="heroicons:chevron-down"
                              className={cn(
                                "h-5 w-5 transition-all duration-300",
                                {
                                  "rotate-180": collapsedRows.includes(item.id),
                                }
                              )}
                            />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                  {collapsedRows.includes(item.id) && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="pl-12 grid grid-cols-2 gap-2">
                          <p className="flex items-center gap-1 text-sm">
                            <Icon
                              icon="heroicons:arrow-right-circle"
                              className="h-7 w-7 text-primary"
                            />
                            <span className="font-bold text-md">Date :</span>{" "}
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p className="flex items-center gap-1 text-sm">
                            <Icon
                              icon="heroicons:arrow-right-circle"
                              className="h-7 w-7 text-primary"
                            />
                            <span className="font-bold text-md">Pay :</span>
                            {item.price || "N/A"}
                          </p>
                          <p className="flex items-center gap-1 text-sm">
                            <Icon
                              icon="heroicons:arrow-right-circle"
                              className="h-7 w-7 text-primary"
                            />
                            <span className="font-bold text-md">
                              Payment Method :
                            </span>
                            {item.payment_type || "N/A"}
                          </p>
                          <p className="flex items-center gap-1 text-sm">
                            <Icon
                              icon="heroicons:arrow-right-circle"
                              className="h-7 w-7 text-primary"
                            />
                            <span className="font-bold text-md">Mobile :</span>
                            {item.student?.phone || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* pagination */}
      <Pagination
        last_page={archiveData?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />
    </>
  );
};

export default AdminArchiveTable;

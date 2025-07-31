"use client";
import { Fragment, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LessonsStepsLineSpace from "./lessons-steps";
import { Card } from "@/components/ui/card";
import { useGetData } from "@/hooks/useGetData";
import { LessonBoardRowSkeleton } from "@/components/ui/lesson-board-skeleton";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const LessonBoardTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // URL parameters for search
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get search term from URL
  useEffect(() => {
    const studentName = searchParams.get("student_name");
    if (studentName) {
      setSearchTerm(studentName);
    }
  }, [searchParams]);

  // Fetch data using custom useGetData hook with search parameter
  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: `dashboard/lessons-board${
      searchTerm ? `?student_name=${encodeURIComponent(searchTerm)}` : ""
    }`,
    queryKey: ["lessons-board", searchTerm, currentPage],
  });

  const lessonsData = data?.data?.students || [];

  const columns = [
    {
      key: "student-name",
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
      key: "booked",
      label: "Booked",
    },
    {
      key: "progress",
      label: "Progress",
    },
  ];

  const table = useReactTable({
    data: lessonsData || [],
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

  const [collapsedRows, setCollapsedRows] = useState([]);
  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  // Helper function to calculate progress
  const calculateProgress = (student) => {
    const total = student.sessions_count || 0;
    const done = student.sessions_count_done || 0;
    const current = student.sessions_count_current || 0;

    if (total === 0) return "0 of 0 is done";
    return `${done} of ${total} is done`;
  };

  // Helper function to get student type
  const getStudentType = (student) => {
    return student.type || "Unknown";
  };

  // Helper function to get booked sessions
  const getBookedSessions = (student) => {
    return `${student.sessions_count || 0} Sessions`;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update URL with search parameter
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("student_name", value);
    } else {
      params.delete("student_name");
    }

    // Update URL without page refresh
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    refetch();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Search Section */}
      <div className="mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
            Lessons Board
          </h3>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Icon
              icon="heroicons:magnifying-glass"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
            />
            <Input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </form>
      </div>

      <Card title="Simple">
        <Table className="min-w-[150%] md:min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton loading for 3 rows
              Array.from({ length: 3 }).map((_, index) => (
                <LessonBoardRowSkeleton key={`skeleton-${index}`} />
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center text-default-500">
                    <Icon
                      icon="heroicons:exclamation-triangle"
                      className="w-6 h-6 mr-2"
                    />
                    Failed to load lessons board data
                  </div>
                </TableCell>
              </TableRow>
            ) : !lessonsData || lessonsData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center text-default-500">
                    <Icon
                      icon="heroicons:document-text"
                      className="w-6 h-6 mr-2"
                    />
                    No lessons board data found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lessonsData.map((item) => (
                <Fragment key={item.student.id}>
                  <TableRow
                    onClick={() => toggleRow(item.student.id)}
                    className={`cursor-pointer hover:bg-default-100 transition-all duration-300 ${
                      collapsedRows.includes(item.student.id)
                        ? "bg-default-100"
                        : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-3 items-center">
                          <Avatar className="rounded-full">
                            <AvatarImage
                              src={fixImageUrl(item.student.image)}
                            />
                            <AvatarFallback>
                              {getAvatarInitials(item.student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm block text-card-foreground">
                              {item.student.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{item.student.id}</TableCell>
                    <TableCell>{getStudentType(item.student)}</TableCell>
                    <TableCell>{getBookedSessions(item.student)}</TableCell>
                    <TableCell>
                      <span className="text-sm bg-gray-100 dark:bg-gray-900 text-primary border border-primary rounded-full px-4 py-1 font-medium select-none">
                        {calculateProgress(item.student)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => toggleRow(item.student.id)}
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
                                "rotate-180": collapsedRows.includes(
                                  item.student.id
                                ),
                              }
                            )}
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {collapsedRows.includes(item.student.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="">
                        <LessonsStepsLineSpace
                          lessons={item.lessons}
                          reservationId={item.reservation_id}
                          sessionStatus={item.reservation_status}
                          handleSearchSubmit={handleSearchSubmit}
                        />
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
        last_page={data?.data?.last_page}
        setCurrentPage={handlePageChange}
        current_page={currentPage}
        studentsPagination={true}
      />
    </>
  );
};

export default LessonBoardTable;

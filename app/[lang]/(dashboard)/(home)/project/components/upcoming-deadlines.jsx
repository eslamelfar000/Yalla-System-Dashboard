"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// images
import avatar1 from "@/public/images/avatar/avatar-7.jpg";
import avatar2 from "@/public/images/avatar/avatar-2.jpg";
import avatar3 from "@/public/images/avatar/avatar-3.jpg";
import avatar4 from "@/public/images/avatar/avatar-4.jpg";
import avatar5 from "@/public/images/avatar/avatar-5.jpg";
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  {
    key: "teacher",
    label: "Teacher",
  },
  {
    key: "coaching_sessions",
    label: "Coaching Sessions",
  },
  {
    key: "sent_reports",
    label: "Sent Reports",
  },
];

const UpcomingDeadline = ({ data, isLoading, error }) => {
  const teachersActivities = data?.teachers;

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center mb-0">
        <CardTitle>Teachers Activities</CardTitle>
        {/* <Button type="button" color="secondary" >
          View all
        </Button> */}
      </CardHeader>
      <CardContent className="px-0 overflow-x-auto pb-0">
        <Table>
          <TableHeader className="bg-default-200">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="text-sm font-semibold text-default-800"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
              <TableRow>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableCell
                    key={index}
                    className="text-center"
                  >
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ))
            ) : teachersActivities?.length > 0 ? (
              teachersActivities?.map((item) => (
                <TableRow key={item.id} className="hover:bg-default-100">
                  <TableCell className="flex items-center gap-2 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item?.image} alt="" />
                      <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-defualt-600 whitespace-nowrap">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-default-600 overflow-hidden text-ellipsis whitespace-nowrap max-w-[181px] py-2">
                    {item.booked_coaching_sessions > 1
                      ? item.booked_coaching_sessions + " Sessions"
                      : item.booked_coaching_sessions + " Session"}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-success whitespace-nowrap py-2">
                    {item.sent_reports > 1
                      ? item.sent_reports + " Reports"
                      : item.sent_reports + " Report"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <p className="text-sm font-medium text-default-600 h-10 flex items-center justify-center">No data found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadline;

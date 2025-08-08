"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SharedSheet } from "@/components/Shared/Drawer/shared-sheet";
import { SharedAlertDialog } from "@/components/Shared/Drawer/shared-dialog";
import { useUsers, useUpdateTeacherStatus } from "@/hooks/useUsers";
import { useAxios } from "@/config/axios.config";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import SwitchStatusDialog from "@/components/Shared/Dialog/switch-status-dialog";
import Pagination from "@/components/Shared/Pagination/Pagination";

const UsersTableStatus = ({ type }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSwitchDialogOpen, setIsSwitchDialogOpen] = useState(false);
  const [switchState, setSwitchState] = useState({
    userId: null,
    isNew: false,
    userName: "",
  });

  // Fetch users based on type (role)
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers(type, currentPage);


  const axiosInstance = useAxios();

  const columns = [
    {
      key: "Name",
      label: "Name",
    },
    {
      key: "ID",
      label: "ID",
    },
    {
      key: "Phone Number",
      label: "Phone Number",
    },
    {
      key: "Email",
      label: "Email",
    },
    {
      key: "Status",
      label: "Status",
    },
    ...(type === "teacher"
      ? [
          {
            key: "is-new",
            label: "IS-New",
          },
        ]
      : []),
    {
      key: "action",
      label: "action",
    },
  ];

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      setIsUpdating(true);
      await axiosInstance.delete(`dashboard/users/${userId}`);
      await refetch();
    } catch (error) {
    } finally {
      setIsUpdating(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
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
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-red-500">
            Error loading users: {error?.message || "Something went wrong"}
          </p>
        </div>
      </Card>
    );
  }

  // No data state
  const handelEmpty = () => {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center py-8">
          No {type === "teacher" ? "teachers" : "quality assurance users"} found
        </TableCell>
      </TableRow>
    );
  };

  // console.log(users?.data?.data);

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}> {column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!users || users?.data?.data?.length === 0
              ? handelEmpty()
              : users?.data?.data?.map((item) => (
                  <TableRow
                    key={item.id || item.email}
                    className="hover:bg-default-100"
                  >
                    <TableCell className=" font-medium  text-card-foreground/80">
                      <div className="flex gap-3 items-center">
                        <Avatar className="rounded-lg">
                          <AvatarImage
                            src={
                              item.avatar || item.image || item.profile_image
                            }
                          />
                          <AvatarFallback>
                            {item.name
                              ? item.name.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-default-600">
                          {item.name || item.full_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.user_id || item.id}</TableCell>
                    <TableCell>
                      {item.phone || item.phone_number || item.name}
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "active" ? "success" : "destructive"
                        }
                        className={`${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "active" ? "Active" : "Not Active"}
                      </Badge>
                    </TableCell>
                    {type === "teacher" && (
                      <TableCell>
                        <Switch
                          id={`teacher-status-${item.user_id}`}
                          checked={item.is_new}
                          disabled={isUpdating}
                          onCheckedChange={(checked) => {
                            setSwitchState({
                              userId: item.user_id,
                              isNew: checked,
                              userName: item.name,
                            });
                            setIsSwitchDialogOpen(true);
                          }}
                        />
                      </TableCell>
                    )}

                    <TableCell className="flex gap-3">
                      <SharedSheet
                        type={`edit-${type}`}
                        user={item}
                        open={isSheetOpen && selectedUser?.id === item.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setIsSheetOpen(false);
                            setSelectedUser(null);
                          }
                        }}
                        onSuccess={async () => {
                          await refetch();
                          setIsSheetOpen(false);
                          setSelectedUser(null);
                        }}
                        onReset={() => {
                          setIsSheetOpen(false);
                          setSelectedUser(null);
                        }}
                      />
                      <SharedSheet
                        type={`show-${type}`}
                        user={item}
                        open={isSheetOpen && selectedUser?.id === item.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setIsSheetOpen(false);
                            setSelectedUser(null);
                          }
                        }}
                      />
                      <SharedAlertDialog
                        type={`delete-${type}`}
                        info={item}
                        open={
                          (isDeleteDialogOpen &&
                            selectedUserId === item.user_id) ||
                          item.id
                        }
                        onOpenChange={(open) => {
                          if (!open && !isUpdating) {
                            setIsDeleteDialogOpen(false);
                            setSelectedUserId(null);
                          }
                        }}
                        onConfirm={() => {
                          setSelectedUserId(item.user_id || item.id);
                          handleDeleteUser(item.user_id || item.id);
                        }}
                        isDeleting={isUpdating}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Card>

      {/* Switch Status Dialog */}
      <SwitchStatusDialog
        open={isSwitchDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isUpdating) {
            setIsSwitchDialogOpen(false);
            setSwitchState({ userId: null, isNew: false, userName: "" });
          }
        }}
        userId={switchState.userId}
        userName={switchState.userName}
        isNew={switchState.isNew}
        onSuccess={refetch}
      />

      {/* Pagination */}
      <Pagination
        last_page={users?.data?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
      />
    </div>
  );
};

export default UsersTableStatus;

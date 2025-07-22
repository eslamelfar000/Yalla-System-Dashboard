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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const AdminArchiveTable = ({ role }) => {
  return (
    <div>
      <h1>Admin Archive Table - Test</h1>
      <p>Role: {role}</p>
    </div>
  );
};

export default AdminArchiveTable;

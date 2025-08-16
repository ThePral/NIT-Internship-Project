"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useQueryParams } from "@/hooks";

const SortableHeader = ({
  column,
  sortKey,
  label,
}: {
  column: any;
  sortKey: string;
  label: string;
}) => {
  const { setQueryParam } = useQueryParams();

  return (
    <Button variant="ghost" onClick={() => setQueryParam("sort", sortKey)}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
      {/* Changed mr-2 to ml-2 for RTL */}
    </Button>
  );
};

export const acceptedStudentsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="id" label="شناسه" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "national_id",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="national_id" label="کد ملی" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("national_id")}</div>
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="first_name" label="نام" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="last_name"
        label="نام خانوادگی"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "major_name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="major_name"
        label="رشته پذیرفته شده"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("major_name")}</div>
    ),
  },
  {
    accessorKey: "acceptance_type",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="acceptance_type"
        label="نوع پذیرش"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("acceptance_type")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      // Action cells implementation here
    },
  },
];

export const majorsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="id" label="شناسه" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="name" label="نام رشته" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "field",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="field" label="زمینه تحصیلی" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("field")}</div>
    ),
  },
  {
    accessorKey: "degree",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="degree" label="مقطع" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("degree")}</div>
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="capacity" label="ظرفیت" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("capacity")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const major = row.original;
      // Action cells implementation here
    },
  },
];

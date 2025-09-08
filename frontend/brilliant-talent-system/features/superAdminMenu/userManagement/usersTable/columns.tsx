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
import { ArrowUpDown, Edit, MoreHorizontal, Trash2Icon } from "lucide-react";
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
      <ArrowUpDown className="mr-2 h-4 w-4" />
    </Button>
  );
};

export const usersColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="username" label="نام کاربری" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="firstname"
        label="نام "
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("firstname")}</div>
    ),
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="lastname"
        label="نام خانوادگی"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("lastname")}</div>
    ),
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="grade"
        label="نمره معدل"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("grade")}</div>
    ),
  },
  {
    accessorKey: "points",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="points"
        label="امتیاز"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("points")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 hover:bg-card hover:scale-110 transition-all duration-200"
            >
              <MoreHorizontal className="h-4 w-4 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                const event = new CustomEvent("open-edit-dialog", {
                  detail: user,
                });
                window.dispatchEvent(event);
              }}
            >
              <Edit className="h-4 w-4 ml-2" />
              <p className=" text-primary"> ویرایش</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

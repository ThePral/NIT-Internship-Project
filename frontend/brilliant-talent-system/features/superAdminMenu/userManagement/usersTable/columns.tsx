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
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                const event = new CustomEvent("open-delete-dialog", {
                  detail: user,
                });
                window.dispatchEvent(event);
              }}
            >
              <Trash2Icon className="h-4 w-4 ml-2" />
              <p className=" text-danger"> حذف</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

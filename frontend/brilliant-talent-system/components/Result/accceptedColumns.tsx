"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";
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

  const handleSort = () => {
    // First update the URL parameter
    setQueryParam("sort", sortKey);
    
    // Then toggle the sorting in the table itself
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  return (
    <Button variant="ghost" onClick={handleSort}>
      {label}
      <ArrowUpDown className="mr-2 h-4 w-4" />
    </Button>
  );
};

export const acceptedColumns: ColumnDef<any>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="firstname"
        label="نام"
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
    accessorKey: "university.name",
    header: "دانشگاه",
    cell: ({ row }) => (
      <div className="text-center">{row.original.university?.name}</div>
    ),
  },
  {
    id: "priorities",
    header: "اولویت‌ها",
    cell: ({ row }) => {
      const priorities = row.original.priorities || [];
      
      return (
        <div className="text-center">
          {priorities.map((priority: any, index: number) => (
            <div 
              key={index} 
              className={`py-1 ${priority.isAccepted ? 'text-green-600 font-medium' : 'text-red-500'}`}
            >
              {priority.priority}. {priority.minor.name}
              {priority.isAccepted && " (پذیرفته شده)"}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
            const copyAcceptedMinor = () => {
        const acceptedPriorities = student.priorities.filter(
          (pr: { isAccepted: boolean }) => pr.isAccepted
        );
        
        if (acceptedPriorities.length > 0) {
          const acceptedNames = acceptedPriorities.map(
            (pr: any) => pr.minor.name
          ).join("، ");
          
          navigator.clipboard.writeText(acceptedNames);
        } else {
          navigator.clipboard.writeText("هیچ رشته‌ای پذیرفته نشده است");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">باز کردن منو</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.firstname + " " + student.lastname)}
            >
              کپی نام
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={copyAcceptedMinor}
              className="cursor-pointer"
            >
                کپی محل قبولی
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
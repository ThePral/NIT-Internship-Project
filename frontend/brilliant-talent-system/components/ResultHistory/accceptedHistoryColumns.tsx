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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useQueryParams } from "@/hooks";
import { HistoryResult } from "@/interfaces/operation";

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
    setQueryParam("sort", sortKey);
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  return (
    <Button variant="ghost" onClick={handleSort}>
      {label}
      <ArrowUpDown className="mr-2 h-4 w-4" />
    </Button>
  );
};

export const acceptedHistoryColumns: ColumnDef<HistoryResult>[] = [
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="studentName"
        label="نام دانشجو"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("studentName")}</div>
    ),
  },
  {
    accessorKey: "universityName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="universityName"
        label="دانشگاه"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("universityName")}</div>
    ),
  },
  {
    accessorKey: "majorName",
    header: "رشته فارغ التحصیلی",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("majorName")}</div>
    ),
  },
  {
    accessorKey: "minorName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="minorName"
        label="نام رشته قبولی"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("minorName")}</div>
    ),
  },
  {
    accessorKey: "minorReq",
    header: "نیازمندی رشته",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("minorReq")}</div>
    ),
  },
  {
    accessorKey: "minorCap",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="minorCap" label="ظرفیت" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("minorCap")}</div>
    ),
  },
  {
    accessorKey: "acceptedPriority",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="acceptedPriority"
        label="اولویت پذیرفته شده"
      />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("acceptedPriority") as number;

      const priorityMap: Record<number, string> = {
        1: "اول",
        2: "دوم",
        3: "سوم",
        4: "چهارم",
        5: "پنجم",
        6: "ششم",
        7: "هفتم",
        8: "هشتم",
        9: "نهم",
        10: "دهم",
      };

      return (
        <div
          className={`text-center font-medium ${
            priority > 0 ? "text-success" : "text-danger"
          }`}
        >
          {priority > 0 ? `اولویت ${priorityMap[priority]}` : "پذیرفته نشده"}
        </div>
      );
    },
  },

  {
    accessorKey: "points",
    header: ({ column }) => (
      <SortableHeader column={column} sortKey="points" label="امتیاز" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-bold">{row.getValue("points")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;

      const copyStudentName = () => {
        navigator.clipboard.writeText(student.studentName);
      };

      const copyMinorInfo = () => {
        const info = `${student.minorName} - ${student.universityName}`;
        navigator.clipboard.writeText(info);
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
            <DropdownMenuItem onClick={copyStudentName}>
              کپی نام دانشجو
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyMinorInfo}>
              کپی اطلاعات رشته
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

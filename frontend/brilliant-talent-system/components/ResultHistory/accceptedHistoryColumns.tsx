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
import { Priority, StudentResult } from "@/interfaces/operation";

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

export const acceptedHistoryColumns: ColumnDef<StudentResult>[] = [
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
    accessorKey: "university",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="university"
        label="دانشگاه"
      />
    ),
    cell: ({ row }) => {
      const uni:{name:string} = row.getValue("university")
      const uniName = uni.name
      return <div className="text-center">{uniName}</div>
    },
  },
  {
    accessorKey: "majorName",
    header: "رشته فارغ التحصیلی",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("majorName")}</div>
    ),
  },
  {
    accessorKey: "priorities",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        sortKey="priorities"
        label="اولویت پذیرفته شده"
      />
    ),
    cell: ({ row }) => {
      let priority = undefined
      const priorities :Priority[] = row.getValue("priorities")

      priorities.forEach((p)=>{
        if(p.isAccepted){
          priority =  p.minor.name
        }
      }
      )

      // const priorityMap: Record<number, string> = {
      //   1: "اول",
      //   2: "دوم",
      //   3: "سوم",
      //   4: "چهارم",
      //   5: "پنجم",
      //   6: "ششم",
      //   7: "هفتم",
      //   8: "هشتم",
      //   9: "نهم",
      //   10: "دهم",
      // };

      return (
        <div
          className={`text-center font-medium ${
            priority  ? "text-success" : "text-danger"
          }`}
        >
          {priority  ? priority : "پذیرفته نشده"}
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
        navigator.clipboard.writeText(student.firstname + '-' + student.lastname );
      };

      const copyMinorInfo = () => {
        let priority = undefined
        const priorities :Priority[] = row.getValue("priorities")

        priorities.forEach((p)=>{
          if(p.isAccepted){
            priority =  p.minor.name
          }
        })
        navigator.clipboard.writeText(priority ?? 'پذیرفته نشده');
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

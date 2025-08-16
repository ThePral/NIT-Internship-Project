"use client";

import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTitle2,
  ResponsiveModalTrigger,
} from "@/components/ui/responsiveModal";
import { Download, Printer } from "lucide-react";
import "@/globals.css";

interface UploadTableModalProps {
  title: string;
  children: React.ReactNode;
}

const TablePlaceholder = () => (
  <div className="w-full rounded-lg border border-border overflow-hidden">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-input text-center text-sm font-semibold text-foreground">
          {Array.from({ length: 6 }).map((_, i) => (
            <th
              key={i}
              className={`h-12 border border-border
                ${i === 0 ? "rounded-tr-lg" : ""} 
                ${i === 5 ? "rounded-tl-lg" : ""}`}
            >
              {
                [
                  "ردیف",
                  "نام و نام خانوادگی",
                  "کد ملی",
                  "رشته",
                  "تاریخ",
                  "وضعیت",
                ][i]
              }
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <tr key={rowIndex} className="text-center">
            {Array.from({ length: 6 }).map((_, cellIndex) => (
              <td
                key={cellIndex}
                className={`h-16 border border-border text-foreground
                  ${rowIndex === 3 && cellIndex === 0 ? "rounded-br-lg" : ""}
                  ${rowIndex === 3 && cellIndex === 5 ? "rounded-bl-lg" : ""}
                `}
              >
                {cellIndex === 0 ? rowIndex + 1 : "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const UploadTableModal = ({
  title,
  children,
}: UploadTableModalProps) => {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>{children}</ResponsiveModalTrigger>

      <ResponsiveModalContent className="rounded-lg" size="5xl">
        {/* Header */}
        <ResponsiveModalHeader className="grid grid-cols-2 items-center border-b border-border py-4 px-6">
          {/* Title */}
          <ResponsiveModalTitle2 className="text-lg font-bold text-primary">
            {title}
          </ResponsiveModalTitle2>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button className="flex items-center gap-2 text-sm text-danger hover:text-primary transition-colors">
              <Download className="h-5 w-5" />
              <span>دانلود</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-success hover:text-primary transition-colors">
              <Printer className="h-5 w-5" />
              <span>پرینت</span>
            </button>
          </div>
        </ResponsiveModalHeader>

        {/* Table */}
        <div className="p-6">
          <TablePlaceholder />
        </div>

        {/* Footer */}
        <ResponsiveModalFooter className="justify-start gap-3 border-t border-border py-4 px-6">
          <ResponsiveModalClose asChild>
            <Button
              type="button"
              className="rounded-md bg-primary px-6 py-2 font-bold text-card hover:bg-[#1e40af]/90 transition-colors"
            >
              بستن
            </Button>
          </ResponsiveModalClose>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

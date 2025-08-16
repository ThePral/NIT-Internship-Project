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
  <div className="w-full rounded-lg border border-border ">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#f0f5ff] text-center text-sm font-semibold text-foreground">
          {Array.from({ length: 6 }).map((_, i) => (
            <th
              key={i}
              className={`h-12 border border-[#e0e0e0] ${
                i === 0 ? "rounded-tl-lg" : ""
              } ${i === 5 ? "rounded-tr-lg" : ""}`}
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
                className="h-16 border border-[#e0e0e0] text-[#666]"
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

      <ResponsiveModalContent className="sm:max-w-5xl rounded-lg">
        {/* Header */}
        <ResponsiveModalHeader className="flex items-center justify-between border-b border-[#e0e0e0] py-4 px-6">
          <div className="flex items-center justify-between gap-6 ">
            <ResponsiveModalTitle2 className="text-lg font-bold text-[#1e40af]">
              {title}
            </ResponsiveModalTitle2>

            {/* Print & Download buttons - now horizontal */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-[#ef4444] hover:text-[#1e40af] transition-colors">
                <Download className="h-5 w-5" />
                <span>دانلود</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-[#22c55e] hover:text-[#1e40af] transition-colors">
                <Printer className="h-5 w-5" />
                <span>پرینت</span>
              </button>
            </div>
          </div>
        </ResponsiveModalHeader>

        {/* Table */}
        <div className="p-6">
          <TablePlaceholder />
        </div>

        {/* Footer */}
        <ResponsiveModalFooter className="justify-start gap-3 border-t border-[#e0e0e0] py-4 px-6">
          <ResponsiveModalClose asChild>
            <Button
              type="button"
              className="rounded-md bg-[#1e40af] px-6 py-2 font-bold text-white hover:bg-[#1e40af]/90 transition-colors"
            >
              بستن
            </Button>
          </ResponsiveModalClose>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

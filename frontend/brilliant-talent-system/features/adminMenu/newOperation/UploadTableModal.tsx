"use client";

import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsiveModal";
import { Download, Printer } from "lucide-react";

interface UploadTableModalProps {
  title: string;
  children: React.ReactNode;
}

// A placeholder for the table content shown in the image
const TablePlaceholder = () => (
  <div className="w-full rounded-lg border bg-card p-2">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b">
          {Array.from({ length: 6 }).map((_, i) => (
            <th key={i} className="p-4"></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b last:border-none">
            {Array.from({ length: 6 }).map((_, cellIndex) => (
              <td key={cellIndex} className="h-16 p-2"></td>
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

      {/* Set a wider max-width for the modal */}
      <ResponsiveModalContent className="sm:max-w-4xl">
        <ResponsiveModalHeader className="flex items-center justify-between">
          <ResponsiveModalTitle className="text-xl font-bold text-primary">
            {title}
          </ResponsiveModalTitle>

          {/* Print and Download buttons */}
          <div className="flex items-center gap-4">
            <button className="flex flex-col items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
              <Printer className="h-6 w-6" />
              <span>پرینت</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
              <Download className="h-6 w-6" />
              <span>دانلود</span>
            </button>
          </div>
        </ResponsiveModalHeader>

        <div className="p-6">
          <TablePlaceholder />
        </div>

        {/* The "Close" button is aligned to the left (end of an RTL layout) */}
        <ResponsiveModalFooter className="justify-end">
          <ResponsiveModalClose asChild>
            <Button type="button">بستن</Button>
          </ResponsiveModalClose>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

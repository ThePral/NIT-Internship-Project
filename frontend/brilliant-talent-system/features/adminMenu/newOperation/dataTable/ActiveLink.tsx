// components/ActionLink.tsx
"use client";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
} from "@/components/ui/responsiveModal";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Download, Printer } from "lucide-react";

interface ActionLinkProps {
  Icon: React.ElementType;
  label: string;
  modalTitle: string;
  modalDescription: string;
  children: ReactNode;
  onClose?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const ActionLink = ({
  Icon,
  label,
  modalTitle,
  modalDescription,
  children,
  onClose,
  onPrint,
  onDownload,
}: ActionLinkProps) => (
  <ResponsiveModal>
    <ResponsiveModalTrigger asChild>
      <div className="flex cursor-pointer flex-col items-center gap-4 text-primary transition-transform hover:scale-105">
        <Icon className="h-12 w-12 text-primary/80" strokeWidth={1.5} />
        <span className="text-base font-semibold">{label}</span>
      </div>
    </ResponsiveModalTrigger>
    <ResponsiveModalContent
      className="sm:max-w-5xl rounded-lg shadow-md"
      size="5xl"
    >
      <ResponsiveModalHeader className="flex flex-row items-center border-b border-border py-4 px-6 w-full">
        {/* Title - Right side (end in RTL) */}
        <div className="flex justify-start flex-1 min-w-0">
          <ResponsiveModalTitle className="text-lg font-bold text-primary truncate text-right">
            {modalTitle}
          </ResponsiveModalTitle>
        </div>
        {/* Buttons - Left side (start in RTL) */}
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrint}
            className="flex items-center gap-1.5 text-success hover:bg-success/10 px-3 py-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>پرینت</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="flex items-center gap-1.5 text-danger hover:bg-danger/10 px-3 py-1.5"
          >
            <Download className="h-4 w-4" />
            <span>دانلود</span>
          </Button>
        </div>
      </ResponsiveModalHeader>

      <div className="px-6 py-1">
        <ResponsiveModalDescription className="pt-3 text-sm text-muted-foreground leading-relaxed">
          {/* {modalDescription} */}
        </ResponsiveModalDescription>
        {children}
      </div>
    </ResponsiveModalContent>
  </ResponsiveModal>
);

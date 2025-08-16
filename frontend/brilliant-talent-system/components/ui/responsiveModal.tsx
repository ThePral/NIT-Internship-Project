"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ResponsiveModal = DialogPrimitive.Root;
const ResponsiveModalTrigger = DialogPrimitive.Trigger;
const ResponsiveModalClose = DialogPrimitive.Close;
const ResponsiveModalPortal = DialogPrimitive.Portal;

const ResponsiveModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
ResponsiveModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const modalVariants = cva(
  cn(
    "fixed z-50 gap-4 bg-muted p-6 shadow-lg rounded-lg",
    "overflow-y-auto",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500"
  ),
  {
    variants: {
      position: {
        center: cn(
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[95vw] max-w-md md:max-w-lg",
          "max-h-[85vh]",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        ),
        top: cn(
          "inset-x-0 top-0 mx-auto mt-4 w-[95vw] max-w-md rounded-b-lg border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
        ),
        bottom: cn(
          "inset-x-0 bottom-0 mx-auto mb-4 w-[95vw] max-w-md rounded-t-lg border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
        ),
        left: cn(
          "inset-y-0 left-0 h-full w-3/4 max-w-sm rounded-r-lg border-r",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
        ),
        right: cn(
          "inset-y-0 right-0 h-full w-3/4 max-w-sm rounded-l-lg border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        ),
      },
      size: {
        sm: "max-w-xs",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
        full: "w-[95vw] h-[95vh]",
      },
    },
    defaultVariants: {
      position: "center",
      size: "md",
    },
  }
);

interface ResponsiveModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalVariants> {}

const ResponsiveModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ResponsiveModalContentProps
>(({ className, position, size, children, ...props }, ref) => (
  <ResponsiveModalPortal>
    <ResponsiveModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(modalVariants({ position, size }), className)}
      {...props}
    >
      {children}
      <ResponsiveModalClose className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ResponsiveModalClose>
    </DialogPrimitive.Content>
  </ResponsiveModalPortal>
));
ResponsiveModalContent.displayName = DialogPrimitive.Content.displayName;

const ResponsiveModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
ResponsiveModalHeader.displayName = "ResponsiveModalHeader";

const ResponsiveModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
ResponsiveModalFooter.displayName = "ResponsiveModalFooter";

const ResponsiveModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
ResponsiveModalTitle.displayName = DialogPrimitive.Title.displayName;

const ResponsiveModalTitle2 = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight flex justify-between",
      className
    )}
    {...props}
  />
));
ResponsiveModalTitle2.displayName = DialogPrimitive.Title.displayName;

const ResponsiveModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ResponsiveModalDescription.displayName =
  DialogPrimitive.Description.displayName;

export {
  ResponsiveModal,
  ResponsiveModalPortal,
  ResponsiveModalOverlay,
  ResponsiveModalTrigger,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalFooter,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalTitle2,
};

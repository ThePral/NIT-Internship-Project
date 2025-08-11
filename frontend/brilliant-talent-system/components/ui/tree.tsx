"use client";

import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tree = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
));
Tree.displayName = "Tree";

const TreeItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));
TreeItem.displayName = "TreeItem";

interface TreeItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
}

const TreeItemContent = React.forwardRef<HTMLDivElement, TreeItemContentProps>(
  ({ className, isSelected = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center h-8 rounded-md text-sm hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent/50",
        className
      )}
      {...props}
    />
  )
);
TreeItemContent.displayName = "TreeItemContent";

const TreeItemToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "mr-1 h-4 w-4 shrink-0 items-center justify-center rounded-sm",
      className
    )}
    {...props}
  />
));
TreeItemToggle.displayName = "TreeItemToggle";

const TreeItemToggleIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex h-3 w-3 items-center justify-center", className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-3 w-3" />}
  </span>
));
TreeItemToggle.displayName = "TreeItemToggleIcon";

export { Tree, TreeItem, TreeItemContent, TreeItemToggle, TreeItemToggleIcon };

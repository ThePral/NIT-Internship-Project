"use client";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import "@/app/globals.css";
import {
  SidebarContent,
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar";
import InnerLayout from "@/layouts/InnerLayout/InnerLayout";
import SuperAdminLayout from "./SuperAdminLayout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <InnerLayout role="admin">
      <SuperAdminLayout children={children} />
    </InnerLayout>
  );
}

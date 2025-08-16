"use client";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import "@/globals.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-background min-h-screen  flex flex-col">
        <AdminNavbar userName={"آرسام"} userMajor={"کامپیوتر"} />
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 lg:w-72 fixed md:static h-full z-10">
            <AdminSidebar />
          </div>
          <div className="w-full px-5 pb-5 max-md:px-0 mt-20">{children}</div>
        </div>
      </div>
    </div>
  );
}

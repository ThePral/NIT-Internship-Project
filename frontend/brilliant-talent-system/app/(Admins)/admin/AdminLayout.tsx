"use client";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import "@/app/globals.css";
import { SidebarContent, SidebarProvider , Sidebar } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-background  min-h-screen  flex flex-col">
        <SidebarProvider>
          <AdminNavbar/>
          <div className="flex flex-col max-h-screen overflow-hidden md:flex-row w-full">
            
            <div className="md:block hidden top-0 right-0 me-4">
              <AdminSidebar/>
            </div>
            <div className="md:hidden flex">
                <Sidebar side='right'>
                  <SidebarContent>
                      <AdminSidebar/>
                  </SidebarContent>
              </Sidebar>
            </div>
        
            <div className="w-full max-h-screen overflow-auto px-5 pb-5 max-md:px-0 mt-20">{children}</div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

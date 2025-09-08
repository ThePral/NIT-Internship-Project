"use client";
import "@/app/globals.css";
import {
  SidebarContent,
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/SuperAdmin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/SuperAdmin/SuperAdminNavbar";

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-background  min-h-screen  flex flex-col">
        <SidebarProvider>
          <SuperAdminNavbar />
          <div className="flex flex-col max-h-screen overflow-hidden md:flex-row w-full">
            <div className="md:block hidden top-0 right-4 me-4">
              <SuperAdminSidebar />
            </div>
            <div className="md:hidden flex">
              <Sidebar side="right">
                <SidebarContent>
                  <SuperAdminSidebar />
                </SidebarContent>
              </Sidebar>
            </div>

            <div className="w-full max-h-screen overflow-auto px-5 pb-5 max-md:px-0 mt-20">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

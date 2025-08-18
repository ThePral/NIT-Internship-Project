"use client";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import UserNavbar from "@/components/User/UserNavbar";
import { UserSidebar } from "@/components/User/UserSidebar";
import "@/app/globals.css";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-background  min-h-screen  flex flex-col">
        <SidebarProvider>
          <UserNavbar userName={"آرسام"} userMajor={"کامپیوتر"} />
          <div className="flex flex-col md:flex-row w-full">
            
            <div className="md:block hidden top-0 right-0">
              <UserSidebar/>
            </div>
            <div className="md:hidden flex">
                <Sidebar side='right'>
                  <SidebarContent>
                      <UserSidebar/>
                  </SidebarContent>
              </Sidebar>
            </div>
        
            <div className="w-full px-5 pb-5 max-md:px-0 mt-20">{children}</div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

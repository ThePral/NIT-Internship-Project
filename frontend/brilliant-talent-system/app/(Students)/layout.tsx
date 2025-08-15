"use client";
import UserNavbar from "@/components/User/UserNavbar";
import { UserSidebar } from "@/components/User/UserSidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-background min-h-screen  flex flex-col">
        <UserNavbar userName={"آرسام"} userMajor={"کامپیوتر"} />
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 lg:w-72 fixed md:static h-full z-10">
            <UserSidebar />
          </div>
          <div className="w-full px-5 pb-5 max-md:px-0 mt-20">{children}</div>
        </div>
      </div>
    </div>
  );
}

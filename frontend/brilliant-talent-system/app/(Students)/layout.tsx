"use client";
import UserNavbar from "@/components/User/UserNavbar";
import "@/globals.css";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserNavbar userName={""} userMajor={""} />
      <div className="px-5 pb-5 max-md:px-0 mt-20">{children}</div>
    </div>
  );
}

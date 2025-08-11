"use client";

import Link from "next/link";
import { Home, FileText } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

export default function UserSidebar() {
  return (
    <aside
      className=" w-56 h-screen border-l bg-white p-4 flex flex-col"
      dir="rtl"
    >
      <div className="flex flex-col gap-4 mt-16">
        <SidebarLink href="/" icon={<Home size={20} />} text="خانه" active />
        <SidebarLink
          href="/transcript"
          icon={<FileText size={20} />}
          text="کارنامه"
        />
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, text, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`bg-card flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium transition-colors
        ${
          active
            ? "text-blue-600 bg-blue-50"
            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
        }`}
    >
      {icon}
      {text}
    </Link>
  );
}

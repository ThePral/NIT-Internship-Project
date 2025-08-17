"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { LogOut, ScrollText, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const UserSidebar = () => {
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const router = useRouter();

  interface SidebarItem {
    title: string;
    link: string;
    icon: any;
  }

  const items: SidebarItem[] = [
    { title: "خانه", link: "/home", icon: <User size={18} /> },
    { title: "کارنامه", link: "/transcript", icon: <ScrollText size={18} /> },
    { title: "خروج", link: "/authentication", icon: <LogOut size={18} /> },
  ];

  const logOut = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      setUser(undefined);
      router.push("/authentication");
    },
  });

  function handleClick(link: string) {
    if (link === "/authentication") {
      logOut.mutate();
    }
  }

  return (
    <Card className="flex rounded-none md:pt-20  flex-col gap-2 shadow-none md:w-80 w-full h-screen  pr-0 overflow-auto">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex gap-2 items-center">
            <div
              className={`w-2 rounded-l-lg h-10 ${
                pathname != item.link ? "bg-content" : "bg-primary-color"
              } `}
            ></div>

            <Link
              href={item.link}
              onClick={() => {
                handleClick(item.link);
              }}
              className="flex gap-2 py-4 w-full hover:bg-gray-superlight transition-colors"
            >
              <p className="text-primary">{item.icon}</p>
              <p className="text-primary "> {item.title}</p>
            </Link>
          </div>
          <Separator />
        </div>
      ))}
    </Card>
  );
};

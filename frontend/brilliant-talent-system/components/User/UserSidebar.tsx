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
import UserDropDown from "./UserDropDown";

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
    { title: "خروج", link: "/user/auth", icon: <LogOut size={18} /> },
  ];

  const logOut = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      setUser(undefined);
      router.push("/user/auth");
    },
  });

  function handleClick(link: string) {
    if (link === "/user/auth") {
      logOut.mutate();
    }
  }

  return (
    <div className="h-screen flex items-start  w-full">
      <Card className="flex md:rounded-xl p-4 border-0 md:border rounded-none flex-col gap-2 md:mt-24 shadow-none md:w-80 w-full overflow-auto">
        {items.map((item, index) => (
          <div key={index} className={`${index != items.length -1? 'border-b' : ''}`}>
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
            {/* {index != items.length -1 &&
              <Separator />
            } */}
          </div>
        ))}
        <Separator className="mb-5" />
        
        <div className="md:hidden w-full flex items-center gap-3 border rounded-full bg-accent ps-5 pe-1 py-2">
          <UserDropDown/>
        </div>
      </Card>
    </div>
  );
};

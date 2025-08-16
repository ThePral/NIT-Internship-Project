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
    <>
      {/* Mobile Hamburger Menu */}
      <div className="flex items-center justify-between bg-sidebar p-4 md:hidden">
        <p className="font-bold text-primary">منو</p>
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-100 md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-64 bg-sidebar">
            <Card className="flex flex-col gap-2 h-full shadow-none rounded-none p-1 pr-0 overflow-auto bg-sidebar">
              {items.map((item, index) => (
                <div key={index}>
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-2 rounded-l-lg h-10 ${
                        pathname !== item.link
                          ? "bg-transparent"
                          : "bg-sidebar-primary"
                      }`}
                    ></div>

                    <Link
                      href={item.link}
                      onClick={() => handleClick(item.link)}
                      className="flex gap-2 py-4 w-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-primary">{item.title}</span>
                    </Link>
                  </div>
                  <Separator className="bg-sidebar-border" />
                </div>
              ))}
            </Card>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <Card className="hidden md:flex rounded-none md:pt-20 flex-col gap-2 shadow-none md:w-80 w-full h-screen p-1 pr-0 overflow-auto bg-sidebar">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex gap-2 items-center">
              <div
                className={`w-2 rounded-l-lg h-10 ${
                  pathname !== item.link
                    ? "bg-transparent"
                    : "bg-sidebar-primary"
                }`}
              ></div>

              <Link
                href={item.link}
                onClick={() => handleClick(item.link)}
                className="flex gap-2 py-4 w-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
              >
                <span className="text-primary">{item.icon}</span>
                <span className="text-primary">{item.title}</span>
              </Link>
            </div>
            <Separator className="bg-sidebar-border" />
          </div>
        ))}
      </Card>
    </>
  );
};

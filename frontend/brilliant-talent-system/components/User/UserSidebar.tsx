"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Clock10Icon,
  Clock12Icon,
  FilePlus,
  FileText,
  LogOut,
  PlusCircle,
  ScrollText,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import _ from "lodash";

export const UserSidebar = () => {
  const pathname = usePathname();
  const { user, setUser } = useUser();

  interface SidebarItem {
    title: string;
    link: string;
    icon: any;
  }

  const items: SidebarItem[] = [
    {
      title: "خانه",
      link: "/home",
      icon: <User />,
    },
    {
      title: "کارنامه",
      link: "/transcript",
      icon: <ScrollText />,
    },
    { title: "خروج", link: "/", icon: <LogOut /> },
  ];
  const router = useRouter();

  const logOut = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      setUser(undefined);
      router.push("/authentication");
    },
    onError: (error) => {
      console.log(error);
      // setError(error.message)
    },
  });

  function handleClick(link: string) {
    console.log(user);
    if (link == "/authentication") {
      logOut.mutate();
    }
  }

  return (
    <Card className="flex rounded-none md:pt-20 flex-col gap-2 shadow-none md:w-80 w-full h-screen p-1 pr-0 overflow-auto bg-sidebar">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex  gap-2 items-center">
            <div
              className={`w-2 rounded-l-lg h-10 ${
                pathname != item.link ? "bg-transparent" : "bg-sidebar-primary"
              }`}
            ></div>

            <Link
              href={item.link}
              onClick={() => {
                handleClick(item.link);
              }}
              className="flex gap-2 py-4 w-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            >
              <p className="text-primary">{item.icon}</p>
              <p className="text-primary "> {item.title}</p>
            </Link>
          </div>
          <Separator className="bg-sidebar-border" />
        </div>
      ))}
    </Card>
  );
};

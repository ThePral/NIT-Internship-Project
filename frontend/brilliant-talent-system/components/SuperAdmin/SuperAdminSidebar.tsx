"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  FilePlus,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  PlusCircle,
  ScrollText,
  User,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import _ from "lodash";
import SuperAdminDropDown from "./SuperAdminDropDown";
import UserDropDown from "../User/UserDropDown";

export const SuperAdminSidebar = () => {
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
      link: "/superAdmin/home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "مدیریت ادمین‌ها",
      link: "/superAdmin/adminManagement",
      icon: <UserCog className="h-5 w-5" />, // Represents admin users with settings
    },
    {
      title: "مدیریت دانشجویان",
      link: "/superAdmin/userManagement",
      icon: <GraduationCap className="h-5 w-5" />, // Represents students/learners
    },
    {
      title: "عملیات جدید",
      link: "/superAdmin/newOperation",
      icon: <FilePlus className="h-5 w-5" />,
    },
    {
      title: "قوانین",
      link: "/superAdmin/rules",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "تاریخچه",
      link: "/superAdmin/history",
      icon: <Clock className="h-5 w-5" />,
    },
    { title: "خروج", link: "/superAdmin/auth", icon: <LogOut /> },
  ];
  const router = useRouter();

  const logOut = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      setUser(undefined);
      router.push("/user/auth");
    },
    onError: (error) => {
      console.log(error);
      // setError(error.message)
    },
  });

  function handleClick(link: string) {
    console.log(user);
    if (link == "/user/auth") {
      logOut.mutate();
    }
  }

  return (
    <div className="h-screen flex items-start  w-full">
      <Card className="flex md:rounded-xl p-4 border-0 md:border rounded-none flex-col gap-2 md:mt-24 shadow-none md:w-80 w-full overflow-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className={`${index != items.length - 1 ? "border-b" : ""}`}
          >
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
          </div>
        ))}
        <Separator className="mb-5" />

        <div className="md:hidden w-full flex items-center gap-3 border rounded-full bg-accent ps-5 pe-1 py-2">
          <UserDropDown />
        </div>
      </Card>
    </div>
  );
};

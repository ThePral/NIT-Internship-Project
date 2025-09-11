"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks";
import { Separator } from "@radix-ui/react-dropdown-menu";

export const AdminHome = () => {
  const { user } = useUser();

  return (
    <div className="p-4 sm:p-6 font-primary mt-4 flex flex-col sm:grid sm:grid-cols-2 gap-4">
      <Card className="w-full px-4 py-4">
        <CardTitle className="text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-5">
          اطلاعات کاربر
        </CardTitle>
        <CardContent className="grid grid-cols-1 gap-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <p className="opacity-80 text-primary font-semibold mb-1 sm:mb-0">
              نام کاربری:
            </p>
            <p className="break-words">{user?.username || "-"}</p>
          </div>

          <Separator className="my-2 sm:my-4 border opacity-40 " />

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <p className="text-primary font-semibold opacity-80 mb-1 sm:mb-0">
              نقش:
            </p>
            <p>{user?.role === "admin" ? "ادمین" : "مدیر کل"}</p>
          </div>

          <Separator className="my-2 sm:my-4 border opacity-40" />
        </CardContent>
      </Card>
    </div>
  );
};

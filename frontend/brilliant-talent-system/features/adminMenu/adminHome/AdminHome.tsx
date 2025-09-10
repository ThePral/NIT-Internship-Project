"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks";
import { Separator } from "@radix-ui/react-dropdown-menu";

export const AdminHome = () => {
  const {user} = useUser()
  return (
    <div className="  p-6 font-primary mt-4 grid grid-cols-2">
      <Card className="px-4">
        <CardTitle className="text-xl font-semibold text-primary mb-5">اطلاعات کاربر</CardTitle>
        <CardContent className="grid grid-cols-2 ">
          <p className="opacity-80 text-primary font-semibold">نام کاربری:</p>
          <p>{user?.username}</p>
          <Separator className="col-span-2 border my-4 opacity-40"/>
          <p className=" text-primary font-semibold opacity-80">نقش:</p>
          <p>{user?.role == "admin" ? 'مدیر' : 'سوپرادمین' }</p>
        </CardContent>
      </Card>
    </div>
  );
};

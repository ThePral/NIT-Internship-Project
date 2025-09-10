import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks";
import { StudentReport } from "@/interfaces/operation";
import React from "react";

interface ProfileCardProps {
  result: StudentReport;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ result }) => {
  const { user } = useUser();
  const info = [
    { label: "نام", value: result.firstname },
    { label: "نام خانوادگی", value: result.lastname },
    {
      label: "تاریخ تولد",
      value: (() => {
        const date = new Date(user?.birthDate ?? "");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
      })(),
    },
    { label: "کد ملی", value: user?.nationalCode },
    // { label: "رشته تحصیلی", value: user. },
    { label: "دانشگاه محل اخذ مدرک", value: result.university.name },
    // { label: "دیپلم", value: degree },
  ];

  return (
    <Card className="bg-sidebar shadow-primary text-sidebar-foreground w-full max-w-md rounded-lg shadow">
      <CardHeader>
        <CardTitle className="text-sidebar-primary text-lg font-bold text-right">
          اطلاعات دانشجو
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full mt-10">
        <div className="grid grid-cols-2 gap-y-4 text-sm sm:text-base h-full content-between text-right">
          {info.map((item, idx) => (
            <React.Fragment key={idx}>
              <span
                className={`text-sidebar-accent-foreground font-medium ${
                  item.label ? "block" : "hidden"
                }`}
              >
                {item.label}
              </span>
              <span className="text-foreground truncate">{item?.value}</span>
              <Separator className="col-span-2 opacity-50" />
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

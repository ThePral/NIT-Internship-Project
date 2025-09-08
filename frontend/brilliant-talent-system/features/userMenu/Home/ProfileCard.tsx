import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationalId: string;
  major: string;
  university: string;
  degree: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName,
  lastName,
  birthDate,
  nationalId,
  major,
  university,
  degree,
}) => {
  const info = [
    { label: "نام", value: firstName },
    { label: "نام خانوادگی", value: lastName },
    { label: "تاریخ تولد", value: birthDate },
    { label: "کد ملی", value: nationalId },
    { label: "رشته تحصیلی", value: major },
    { label: "دانشگاه محل اخذ مدرک", value: university },
    { label: "دیپلم", value: degree },
  ];

  return (
    <Card className="bg-sidebar shadow-primary text-sidebar-foreground w-full max-w-md rounded-lg shadow">
      <CardHeader>
        <CardTitle className="text-sidebar-primary text-lg font-bold text-right">
          ویرایش رمز عبور
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-4 text-sm sm:text-base text-right">
          {info.map((item, idx) => (
            <React.Fragment key={idx}>
              <span
                className={`text-sidebar-accent-foreground font-medium ${
                  item.label ? "block" : "hidden"
                }`}
              >
                {item.label}
              </span>
              <span className="text-foreground">{item.value}</span>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

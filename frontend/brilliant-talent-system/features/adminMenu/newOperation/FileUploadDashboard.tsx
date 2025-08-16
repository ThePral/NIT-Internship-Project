import type { LucideIcon } from "lucide-react";
import { GraduationCap, School, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const UploadCard = ({
  Icon,
  title,
  description,
  className,
}: UploadCardProps) => {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary/80 hover:bg-accent",
        className
      )}
    >
      <input type="file" className="hidden" />
      <Icon className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
      <div className="space-y-1">
        <p className="font-semibold text-card-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </label>
  );
};

export const FileUploadDashboard = () => {
  const uploadItems: UploadCardProps[] = [
    {
      Icon: GraduationCap,
      title: "جدول دانشجویان نوشیروانی",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
    },
    {
      Icon: GraduationCap,
      title: "جدول دانشجویان دیگر دانشگاه ها",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
    },
    {
      Icon: School,
      title: "جدول دانشگاه ها",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
    },
    {
      Icon: Armchair,
      title: "جدول ظرفیت ها",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
    },
  ];

  return (
    <div className="flex w-full items-center justify-center bg-background px-8 font-primary text-foreground">
      <Card className="w-full">
        <CardHeader className="text-right">
          <CardTitle className="text-2xl font-bold text-primary">
            عملیات جدید
          </CardTitle>
          <CardDescription className="pt-1 text-xl font-extrabold">
            آپلود جداول
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {uploadItems.map((item, index) => (
              <UploadCard
                key={index}
                Icon={item.Icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="lg" className="px-10 py-6 text-base">
            پردازش
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

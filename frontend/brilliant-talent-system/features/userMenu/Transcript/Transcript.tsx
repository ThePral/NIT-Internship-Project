// Transcript.tsx
import { Card, CardContent } from "@/components/ui/card";
import PriorityCard from "./PriorityCard";

interface ProfileInfo {
  label: string;
  value: string;
}

const profileData: ProfileInfo[] = [
  { label: "نام", value: "مهرداد" },
  { label: "نام خانوادگی", value: "محسنی میانه" },
  { label: "رشته تحصیلی", value: "مهندسی کامپیوتر" },
  {
    label: "دانشگاه محل اخذ مدرک کارشناسی",
    value: "دانشگاه علم و فناوری مازندران",
  },
  { label: "معدل کارشناسی", value: "۱۸.۸۳" },
  { label: "رشته قبولی", value: "مهندسی کامپیوتر - هوش مصنوعی و رباتیکز" },
];

export default function Transcript() {
  return (
    <div className="w-full p-4 sm:p-6 space-y-6" dir="rtl">
      <Card className="bg-card border border-border rounded-lg shadow-md">
        <CardContent className="p-4 sm:p-6 space-y-4 text-right">
          {/* Header */}
          <h2 className="text-lg sm:text-xl font-bold text-primary">کارنامه</h2>

          {/* Profile Info */}
          <div className=" gap-y-1 gap-x-6 text-sm text-right">
            {profileData.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 items-center border-b border-muted/30 pb-1 last:border-0"
              >
                <span className="font-medium text-primary">{item.label}</span>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          {/* Priority Cards */}
          <div className="space-y-4 pt-4 grid grid-cols-2">
            <PriorityCard
              priorityLabel="اولویت اول"
              status="error"
              title="مهندسی کامپیوتر - هوش مصنوعی و رباتیکز - روزانه - استعداد درخشان"
              capacity={5}
              rank={8}
              lastAccepted={7}
            />
            <PriorityCard
              priorityLabel="اولویت دوم"
              status="success"
              title="مهندسی کامپیوتر - نرم‌افزار - روزانه"
              capacity={7}
              rank={2}
              lastAccepted={5}
            />
            <PriorityCard
              priorityLabel="اولویت دوم"
              status="success"
              title="مهندسی کامپیوتر - نرم‌افزار - روزانه"
              capacity={7}
              rank={2}
              lastAccepted={5}
            />
            <PriorityCard
              priorityLabel="اولویت دوم"
              status="success"
              title="مهندسی کامپیوتر - نرم‌افزار - روزانه"
              capacity={7}
              rank={2}
              lastAccepted={5}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

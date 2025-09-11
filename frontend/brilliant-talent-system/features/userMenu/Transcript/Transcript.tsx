"use client";
import { Card, CardContent } from "@/components/ui/card";
import PriorityCard from "./PriorityCard";
import useGetStudentResult from "@/hooks/useGetStudentResult";

export default function Transcript() {
  const { data: result, isLoading } = useGetStudentResult();

  if (isLoading || !result) return null;

  if (!result.priorities || result.priorities.length === 0) {
    return (
      <main className="h-fit bg-background flex w-full justify-center items-center p-4">
        <p className="text-muted-foreground text-lg">
          اطلاعاتی برای نمایش موجود نمی‌باشد
        </p>
      </main>
    );
  }

  // Profile data
  const profileData = [
    { label: "نام", value: result.firstname || "-" },
    { label: "نام خانوادگی", value: result.lastname || "-" },
    { label: "دانشگاه محل اخذ مدرک", value: result.university?.name || "-" },
    {
      label: "امتیاز",
      value: result.points != null ? result.points.toString() : "-",
    },
  ];

  return (
    <div className="w-full p-4 sm:p-4 space-y-6" dir="rtl">
      <Card className="bg-card border border-border rounded-lg shadow-md">
        <CardContent className="p-4 sm:px-6 lg:px-8 space-y-4 md:space-y-6 text-right">
          {/* Header */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
            کارنامه
          </h2>

          {/* Profile Info */}
          <div className="gap-y-2 gap-x-6 text-sm sm:text-base">
            {profileData.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 md:grid-cols-4 items-center border-b border-muted/30 pb-1 last:border-0"
              >
                <span className="font-medium text-primary col-span-1">
                  {item.label}
                </span>
                <span className="text-foreground col-span-2 md:col-span-3">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Priority Cards */}
          <div className="space-y-4 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {result.priorities.map((priority) => (
              <PriorityCard
                key={priority.priority}
                priorityLabel={`اولویت ${priority.priority}`}
                status={priority.isAccepted ? "success" : "error"}
                title={priority.minorName || "-"}
                capacity={priority.capacity != null ? priority.capacity : "-"}
                rank={priority.studentRank != null ? priority.studentRank : "-"}
                lastAccepted={
                  priority.lastAcceptedRank != null
                    ? priority.lastAcceptedRank
                    : "-"
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

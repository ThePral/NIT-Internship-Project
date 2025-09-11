"use client";
import useGetStudentResult from "@/hooks/useGetStudentResult";
import { ProfileCard } from "./ProfileCard";
import { ResultCard } from "./ResultCard";

function toPersianOrdinal(num: number): string {
  const map: Record<number, string> = {
    1: "اول",
    2: "دوم",
    3: "سوم",
    4: "چهارم",
    5: "پنجم",
    6: "ششم",
    7: "هفتم",
    8: "هشتم",
    9: "نهم",
    10: "دهم",
    11: "یازدهم",
    12: "دوازدهم",
    13: "سیزدهم",
    14: "چهاردهم",
    15: "پانزدهم",
    16: "شانزدهم",
    17: "هفدهم",
    18: "هجدهم",
    19: "نوزدهم",
    20: "بیستم",
    21: "بیست‌ویکم",
    22: "بیست‌ودوم",
    23: "بیست‌وسوم",
    24: "بیست‌وچهارم",
    25: "بیست‌وپنجم",
    26: "بیست‌وششم",
    27: "بیست‌وهفتم",
    28: "بیست‌وهشتم",
    29: "بیست‌ونهم",
    30: "سی‌ام",
  };

  return map[num] || `${num}ام`;
}

export default function Home() {
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

  return (
    <main className="h-fit bg-background flex w-full justify-center items-start p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileCard result={result} />
        <ResultCard result={result} />
      </div>
    </main>
  );
}

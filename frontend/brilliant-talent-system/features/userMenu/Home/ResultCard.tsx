"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

interface ResultCardProps {
  priority?: string;
  acceptedMajor?: string;
  isAccepted: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  priority,
  acceptedMajor,
  isAccepted,
}) => {
  const router = useRouter();

  return (
    <Card className="bg-sidebar shadow-primary text-sidebar-foreground w-full max-w-md rounded-lg shadow text-center">
      <CardHeader>
        <CardTitle className="text-sidebar-primary text-lg font-bold text-right">
          نتیجه
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* آیکن */}
        <div
          className={`w-20 h-20 mx-auto flex items-center justify-center rounded-full mb-4 ${
            isAccepted ? "bg-success text-white" : "bg-red-500 text-white"
          }`}
        >
          {isAccepted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        {isAccepted ? (
          <>
            <p className="mb-6 text-sm sm:text-base text-foreground">
              شما در اولویت{" "}
              <span className="text-success font-semibold">{priority}</span> خود
              پذیرفته شدید!
            </p>
            <hr className="border-sidebar-border mb-4" />
            <p className="text-sidebar-foreground font-bold mb-2">
              رشته‌ی قبولی
            </p>
            <p className="text-sidebar-foreground mb-6 text-sm sm:text-base leading-relaxed">
              {acceptedMajor}
            </p>
          </>
        ) : (
          <>
            <p className="text-danger text-xl font-semibold mb-2">
              متاسفانه شما در هیچ‌یک از انتخاب‌های خود پذیرفته نشدید
            </p>
            <p className="text-muted-foreground mb-6">
              امیدواریم در فرصت‌های بعدی موفق باشید 🌹
            </p>
          </>
        )}

        <Button
          className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          onClick={() => router.push("/transcript")}
        >
          مشاهده‌ی کارنامه
        </Button>
      </CardContent>
    </Card>
  );
};

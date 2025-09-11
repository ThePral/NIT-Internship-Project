"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { StudentResult } from "@/interfaces/operation";
import { Check, CheckCircle2Icon, CircleX, Clock, X } from "lucide-react";

interface ResultCardProps {
  result?: StudentResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({
result
}) => {
  const router = useRouter();

  const accepted = result?.priorities.filter(pr=>pr.isAccepted==true)[0]
  const isAccepted = result?.priorities.some(pr=>pr.isAccepted==true)

  return (
    <Card className="bg-sidebar shadow-primary text-sidebar-foreground w-full max-w-md rounded-lg shadow text-center">
      <CardHeader>
        <CardTitle className="text-sidebar-primary text-lg font-bold text-right">
          نتیجه
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full justify-between flex flex-col">
        {/* آیکن */}
        {result ?
        <>
          <div
            className={`w-24 h-24 mx-auto flex items-center justify-center rounded-full mb-4 ${
              isAccepted ? "bg-success text-white" : "bg-red-500 text-white"
            }`}
          >
            {isAccepted ? (
              <Check size={50}/>
            ) : (
              <X size={50}/>
            )}
          </div>

          {isAccepted ? (
            <>
              <p className="mb-6 text-sm sm:text-base text-foreground">
                شما در اولویت{" "}
                <span className="text-success font-semibold">{accepted?.priority}</span> خود
                پذیرفته شدید!
              </p>
              <hr className="border-sidebar-border mb-4" />
              <p className="text-sidebar-foreground font-bold mb-2">
                رشته‌ی قبولی
              </p>
              <p className="text-sidebar-foreground mb-6 text-sm sm:text-base leading-relaxed">
                {accepted?.minorName}
              </p>
            </>
          ) : (
            <>
              <p className="text-danger text-xl font-semibold mb-2">
                متاسفانه شما در هیچ‌ یک از انتخاب‌های خود پذیرفته نشدید
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
        </>
        :<>
          <div className="flex flex-col gap-5 h-full justify-center text-lg font-semibold text-primary">
            <div
              className={`w-24 h-24 mx-auto flex items-center justify-center rounded-full mb-4 bg-primary text-white`}
            >
              <Clock size={50}/>
            </div>
            <div className="space-y-2">
              <p>نتایج تا اکنون آماده نشده اند</p>
              <p>لطفا بعدا تلاش کنید</p>
            </div>

          </div>
        </>
        }
      </CardContent>
    </Card>
  );
};

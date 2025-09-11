"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export const Rules = () => {
  return (
    <Card className="max-w-3xl mx-auto mt-6 min-h-[220px] flex flex-col items-center justify-center text-center p-6 sm:p-8 shadow-lg">
      <Info className="w-14 h-14 text-blue-500 mb-4" />
      <CardContent>
        <p className="text-foreground sm:text-lg leading-relaxed">
          در حال حاضر امکان تغییر یا مشاهده قوانین وجود ندارد. به زودی قوانین
          پوشش داده خواهند شد!
        </p>
      </CardContent>
    </Card>
  );
};

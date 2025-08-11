import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";

interface ResultCardProps {
  priority: string;
  acceptedMajor: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  priority,
  acceptedMajor,
}) => {
  return (
    <Card className="bg-card text-card-foreground w-full max-w-md rounded-lg shadow text-center">
      <CardHeader>
        <CardTitle className="text-primary text-lg font-bold text-right">
          نتیجه
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-success text-white mb-4">
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
        </div>

        <p className="mb-6 text-sm sm:text-base">
          شما در اولویت{" "}
          <span className="text-success font-semibold">{priority}</span> خود
          پذیرفته شدید!
        </p>

        <hr className="border-border mb-4" />

        <p className="text-primary font-bold mb-2">رشته ی قبولی</p>
        <p className="text-foreground mb-6 text-sm sm:text-base leading-relaxed">
          {acceptedMajor}
        </p>

        <Button className="bg-primary text-primary-foreground hover:opacity-90">
          مشاهده ی کارنامه
        </Button>
      </CardContent>
    </Card>
  );
};

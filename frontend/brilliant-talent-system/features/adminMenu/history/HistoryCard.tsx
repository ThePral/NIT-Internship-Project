"use client";

import { ChevronLeft } from "lucide-react";
// import { UploadTableModal } from "../newOperation/UploadTableModal";
import { Button } from "@/components/ui/button";

const historyItems = [
  {
    id: 1,
    title: "نتایج",
    fullTitle: "نتایج ۱۴۰۴/۰۶/۱۲",
    date: "۱۴۰۴/۰۶/۱۲",
  },
  { id: 2, title: null, fullTitle: null, date: null },
  { id: 3, title: null, fullTitle: null, date: null },
];

export const HistoryCard = () => {
  return (
    <div className="w-full rounded-xl shadow-primary bg-card p-6 font-primary shadow-sm mt-4">
      <header className="mb-4 flex justify-start">
        <h2 className="text-xl font-bold text-primary">تاریخچه</h2>
      </header>

      <main className="space-y-3">
        {historyItems.map((item , index) => {
          if (item.title && item.fullTitle) {
            return (
              // <UploadTableModal key={item.id} title={item.fullTitle}>
              //   <Button
              //     variant="ghost"
              //     className="flex w-full items-center justify-between rounded-lg bg-muted p-6 text-sm font-semibold text-card-foreground hover:bg-accent"
              //   >
              //     <div dir="">
              //       <span>{item.title}</span>
              //       <span
              //         dir=""
              //         className="mr-2 font-mono text-muted-foreground"
              //       >
              //         {item.date}
              //       </span>
              //     </div>
              //     <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              //   </Button>
              // </UploadTableModal>
              <div key={index}></div>
            );
          }

          return (
            <div
              key={item.id}
              className="h-[60px] w-full rounded-lg bg-muted opacity-50"
            />
          );
        })}
      </main>
    </div>
  );
};

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AcceptedModal from "@/components/Result/AcceptedModal";
import { useState } from "react";

const historyItems = [
  {
    id: 1,
    title: "نتایج",
    fullTitle: "نتایج ۱۴۰۴/۰۶/۱۲",
    date: "۱۴۰۴/۰۶/۱۲",
  },
  {
    id: 2,
    title: "گزارش عملیات",
    fullTitle: "گزارش عملیات ۱۴۰۴/۰۶/۱۰",
    date: "۱۴۰۴/۰۶/۱۰",
  },
  {
    id: 3,
    title: null,
    fullTitle: null,
    date: null,
  },
];

export const HistoryCard = () => {
  const [open , setOpen] = useState(false)
  return (
    <div className="w-full rounded-xl shadow-primary bg-card p-6 font-primary shadow-sm mt-4">
      <header className="mb-4 flex justify-start">
        <h2 className="text-xl font-bold text-primary">تاریخچه</h2>
      </header>

      <main>
        <AcceptedModal isOpen={open} onOpen={setOpen} />
        <Accordion type="single" collapsible className="w-full space-y-2">
          {historyItems.map((item) =>
            item.title && item.fullTitle ? (
              <AccordionItem
                key={item.id}
                value={`item-${item.id}`}
                className="rounded-lg border bg-muted/20"
              >
                <AccordionTrigger className="flex justify-between px-4 py-3 text-right">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.date}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                  {item.fullTitle}
                  <div className="mt-3">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <ChevronLeft size={16} />
                      مشاهده
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div
                key={item.id}
                className="h-[60px] w-full rounded-lg bg-muted opacity-50"
              />
            )
          )}
        </Accordion>
      </main>
    </div>
  );
};

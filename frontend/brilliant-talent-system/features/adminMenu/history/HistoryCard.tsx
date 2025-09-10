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
import useGetHistoryRuns from "@/hooks/useGetHistoryRuns";
import AcceptedHistoryModal from "@/components/ResultHistory/AcceptedHistoryModal";



export const HistoryCard = () => {
  const [open , setOpen] = useState(false)
  const {data:historyItems} = useGetHistoryRuns()
  return (
    <div className="w-full rounded-xl shadow-primary bg-card p-6 font-primary shadow-sm mt-4">
      <header className="mb-4 flex justify-start">
        <h2 className="text-xl font-bold text-primary">تاریخچه</h2>
      </header>

      <main>
        {/* <AcceptedModal isOpen={open} onOpen={setOpen} /> */}
        <Accordion type="single" collapsible className="w-full space-y-2">
          {historyItems?.map((item) => (
              <AccordionItem
                key={item.id}
                value={`item-${item.id}`}
                className="rounded-lg border bg-muted/20"
              >
                <AccordionTrigger className="flex justify-between px-4 py-3 text-right">
                  <span className="font-semibold">{new Date(item.createdAt ?? '').toLocaleDateString('fa-IR')}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                  <div className="mt-3">
                    <AcceptedHistoryModal isOpen={open} onOpen={setOpen} id={item.id}/>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      </main>
    </div>
  );
};

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AcceptedModal from "@/components/Result/AcceptedModal";
import { useState, useMemo } from "react";
import useGetHistoryRuns from "@/hooks/useGetHistoryRuns";
import AcceptedHistoryModal from "@/components/ResultHistory/AcceptedHistoryModal";
import { Separator } from "@/components/ui/separator";
import { toLocalDateTime } from "@/functions/toLocalDateTime";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import ExportDropDown from "@/components/ExportResults/ExportDropDown";
import PersianDateRangePicker from "@/components/DatePicker/PersianDatePicker";


export const HistoryCard = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { data: historyItems } = useGetHistoryRuns();
  
  // State for date range filter
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Handle date changes from the range picker
  const handleDateChange = (name: string, dateValue: string) => {
    if (name === "startDate") {
      setStartDate(dateValue);
    } else if (name === "endDate") {
      setEndDate(dateValue);
    }
  };

  // Filter history items based on date range
  const filteredHistoryItems = useMemo(() => {
    if (!historyItems) return [];
    
    if (!startDate || !endDate) {
      return historyItems;
    }
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return historyItems.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= start && itemDate <= end;
    });
  }, [historyItems, startDate, endDate]);

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="w-full rounded-xl md:mx-auto shadow-primary bg-card p-6 font-primary shadow-sm mt-4">
      <header className="mb-4 flex justify-start">
        <h2 className="text-xl font-bold text-primary">نتایج کنونی</h2>
      </header>
      <main className="mb-5">
        <AcceptedModal isOpen={open2} onOpen={setOpen2} />
      </main>

      <Separator className="opacity-50 my-5" />

      <header className="mb-4 flex flex-col sm:grid grid-cols-2 sm:items-center   gap-5">
        <h2 className="text-xl font-bold text-primary">تاریخچه</h2>
        
        {/* Persian Date Range Picker */}
        <div className="flex gap-2">
          <Label className=" font-semibold text-lg text-primary">بازه زمانی</Label>
          <div className="flex gap-2 items-center">
            <div className={cn("grid gap-2")}>
              <PersianDateRangePicker
                label=""
                startName="startDate"
                endName="endDate"
                startValue={startDate}
                endValue={endDate}
                onChange={handleDateChange}
              />
            </div>
            {(startDate || endDate) && (
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-destructive hover:text-white bg-background border-none rounded-full"
                onClick={clearFilter}
              >
                <X/>
              </Button>
            )}
          </div>
          </div>
      </header>

      <main className="max-h-72 overflow-auto overflow-x-hidden ps-5">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {filteredHistoryItems?.length > 0 ? (
            filteredHistoryItems.slice().reverse().map((item , index) => (
              <div key={item.id} className="flex gap-3">
                <AccordionItem
                  value={`item-${item.id}`}
                  className="rounded-lg border bg-muted/20 flex-1"
                >
                  <AccordionTrigger className="flex justify-between px-4 py-3 text-right">
                    <span className="font-semibold">
                      {toLocalDateTime({
                        date: item.createdAt,
                        type: "DateTimeToFarsi",
                      })}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
                    <div className="mt-3">
                      <AcceptedHistoryModal
                        isOpen={open}
                        onOpen={setOpen}
                        id={item.id}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <ExportDropDown poll={index == 0} runID={item.id} />      
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              موردی یافت نشد
            </div>
          )}
        </Accordion>
      </main>
    </div>
  );
};
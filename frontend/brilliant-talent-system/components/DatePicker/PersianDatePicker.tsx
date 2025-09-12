import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersianDateRangePickerProps {
  label: string;
  startName: string;
  endName: string;
  startValue: string;
  endValue: string;
  onChange: (name: string, dateValue: string) => void;
  clearTrigger?: number;
}

const PersianDateRangePicker = ({ 
  label, 
  startName, 
  endName, 
  startValue, 
  endValue, 
  onChange,
  clearTrigger 
}: PersianDateRangePickerProps) => {
  const [selectedRange, setSelectedRange] = useState<any>([]);
  const [displayValue, setDisplayValue] = useState("انتخاب بازه زمانی");
  const datePickerRef = useRef<any>("");

  // Reset the date picker when clearTrigger changes
  useEffect(() => {
    if (clearTrigger && datePickerRef.current) {
      setSelectedRange([]);
      setDisplayValue("انتخاب بازه زمانی");
      datePickerRef.current.clearValue();
    }
  }, [clearTrigger]);

  // Update the internal state when props change
  useEffect(() => {
    if (startValue && endValue) {
      try {
        // Create proper date objects for the range picker
        const startDateObj = new Date(startValue);
        const endDateObj = new Date(endValue);
        setSelectedRange([startDateObj, endDateObj]);
        
        // Format display value manually
        const startFormatted = formatDateToPersian(startDateObj);
        const endFormatted = formatDateToPersian(endDateObj);
        setDisplayValue(`${startFormatted} - ${endFormatted}`);
      } catch (error) {
        console.error("Error parsing dates:", error);
        setSelectedRange([]);
        setDisplayValue("انتخاب بازه زمانی");
      }
    } else {
      setSelectedRange([]);
      setDisplayValue("انتخاب بازه زمانی");
    }
  }, [startValue, endValue]);

  const handleDateChange = (dates: any) => {
    setSelectedRange(dates);
    
    if (dates && dates.length === 2) {
      try {
        // Convert Persian dates to Gregorian
        const startGregorian = dates[0].toDate();
        const endGregorian = dates[1].toDate();
        
        // Format display value
        const startFormatted = dates[0].format("YYYY/MM/DD");
        const endFormatted = dates[1].format("YYYY/MM/DD");
        setDisplayValue(`${startFormatted} - ${endFormatted}`);
        
        // Update both start and end dates
        onChange(startName, startGregorian.toISOString());
        onChange(endName, endGregorian.toISOString());
      } catch (error) {
        console.error("Error processing dates:", error);
      }
    } else if (!dates || dates.length === 0) {
      // Clear both dates when range is cleared
      setDisplayValue("انتخاب بازه زمانی");
      onChange(startName, "");
      onChange(endName, "");
    }
  };

  // Helper function to format Date objects to Persian format
  const formatDateToPersian = (date: Date): string => {
    try {
      // Convert to Persian format manually
      const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
      
      return persianDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <Label className="text-sm">{label}</Label>
      <DatePicker
        ref={datePickerRef}
        value={selectedRange}
        onChange={handleDateChange}
        calendar={persian}
        locale={persian_fa}
        range
        inputClass="text-sm p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full h-8"
        format="YYYY/MM/DD"
        offsetY={10}
        portal
        calendarPosition="bottom center"
        // render={
        //   <Input 
        //     className="h-8 text-sm"
        //     readOnly
        //     value={displayValue}
        //     placeholder="انتخاب بازه زمانی"
        //   />
        // }
      />
    </div>
  );
};

export default PersianDateRangePicker;
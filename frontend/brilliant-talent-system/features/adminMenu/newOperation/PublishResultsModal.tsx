"use client";

import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsiveModal";

export const PublishResultsModal = () => {
  return (
    <ResponsiveModal>
      {/* دکمه اصلی باز کردن مودال */}
      <ResponsiveModalTrigger asChild>
        <Button
          size="lg"
          className="rounded-md bg-green-500 px-10 py-6 text-base font-bold text-white hover:bg-green-600"
        >
          تایید و انتشار نتایج
        </Button>
      </ResponsiveModalTrigger>

      {/* محتوای مودال */}
      <ResponsiveModalContent className="sm:max-w-lg rounded-lg shadow-md">
        {/* هدر مودال */}
        <ResponsiveModalHeader className="text-right">
          <ResponsiveModalTitle className="text-lg font-bold text-primary text-right">
            تایید و انتشار نتایج
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="pt-3 text-sm text-muted-foreground leading-relaxed text-right">
            با تایید و انتشار نتایج دانشجویان میتوانند از پذیرفته شدن یا نشدن
            خود اطلاع یافته و کارنامه خود را مشاهده نمایند
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        {/* جعبه خاکستری تاریخ */}
        <div className="px-6 pt-4">
          <div className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm">
            <span className="text-muted-foreground">نتایج</span>
            <span className="font-semibold">۱۴۰۴/۰۶/۱۲</span>
          </div>
        </div>

        {/* فوتر با دکمه‌ها */}
        <ResponsiveModalFooter className="flex flex-row-reverse justify-start gap-4 pt-6">
          <Button
            type="button"
            className="rounded-md bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600"
          >
            لغو
          </Button>
          <Button
            type="button"
            className="rounded-md bg-green-500 px-6 py-2 font-bold text-white hover:bg-green-600"
          >
            تایید و انتشار نتایج
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

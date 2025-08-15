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
      <ResponsiveModalTrigger asChild>
        <Button
          size="lg"
          className="bg-green-500 px-12 py-7 text-base font-bold text-primary-foreground hover:bg-success/90"
        >
          تایید و انتشار نتایج
        </Button>
      </ResponsiveModalTrigger>

      <ResponsiveModalContent className="sm:max-w-lg">
        {/* Header with the main title */}
        <ResponsiveModalHeader className="text-right">
          <ResponsiveModalTitle className="text-xl font-bold">
            تایید و انتشار نتایج
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="pt-4 text-muted-foreground">
            با تایید و انتشار نتایج دانشجویان میتوانند از پذیرفته شدن یا نشدن
            خود اطلاع یافته و کارنامه خود را مشاهده نمایند
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        {/* The gray box showing the results date */}
        <div className="px-6 py-4">
          <div className="flex w-full items-center justify-between rounded-md border bg-muted px-4 py-3 text-sm">
            <span className="text-muted-foreground">نتایج</span>
            <span dir="ltr" className="font-semibold">
              ۱۴۰۴/۰۶/۱۲
            </span>
          </div>
        </div>

        {/* Footer with the action buttons */}
        <ResponsiveModalFooter className="flex-row-reverse justify-start gap-4 pt-4">
          <Button
            type="button"
            className="bg-danger font-bold text-primary-foreground hover:bg-danger/90"
          >
            لغو
          </Button>
          <Button
            type="button"
            className="bg-success font-bold text-primary-foreground hover:bg-success/90"
          >
            تایید و انتشار نتایج
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

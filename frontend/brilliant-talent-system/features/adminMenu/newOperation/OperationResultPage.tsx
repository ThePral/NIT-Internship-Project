"use client";

import { GraduationCap, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublishResultsModal } from "./PublishResultsModal";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsiveModal";
import { useState } from "react";
import { acceptedStudentsColumns, majorsColumns } from "./dataTable/columns";
import { GenericDataTable } from "@/features/adminMenu/newOperation/dataTable/GenericDataTable";
import { ActionLink } from "./dataTable/ActiveLink";

export const OperationResultPage = () => {
  const [sampleData] = useState({
    students: [
      {
        national_id: "1234567890",
        full_name: "علی محمدی",
        field: "مهندسی کامپیوتر",
        acceptance_type: "قطعی",
        score: 18.75,
      },
      {
        national_id: "0987654321",
        full_name: "فاطمه احمدی",
        field: "مهندسی برق",
        acceptance_type: "پذیرش مشروط",
        score: 16.25,
      },
    ],
    fields: [
      {
        field_code: "CE-101",
        field_name: "مهندسی کامپیوتر",
        degree: "کارشناسی",
        capacity: 50,
        faculty: "فنی مهندسی",
      },
      {
        field_code: "EE-201",
        field_name: "مهندسی برق",
        degree: "کارشناسی ارشد",
        capacity: 30,
        faculty: "فنی مهندسی",
      },
    ],
  });

  return (
    <div className="flex w-full items-center justify-center bg-background px-8 font-primary text-foreground mt-4">
      <Card className="w-full border-primary">
        <CardHeader className="items-end text-right">
          <CardTitle className="text-2xl font-bold text-primary">
            نتیجه عملیات
          </CardTitle>
          <CardDescription className="mt-4 rounded-2xl bg-success/20 px-6 py-3 text-right text-success font-medium w-fit">
            <p>
              عملیات با موفقیت انجام شد.{" "}
              <span dir="ltr" className="font-mono">
                13:33:21 - 1404/09/09
              </span>
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <section className="flex items-center justify-start gap-24">
            <ActionLink
              Icon={GraduationCap}
              label="لیست پذیرفته شدگان"
              modalTitle="لیست پذیرفته شدگان"
              modalDescription="لیست کامل دانشجویان پذیرفته شده در دوره"
              onClose={() => console.log("Modal closed")}
              onPrint={() => window.print()}
            >
              <GenericDataTable
                data={sampleData.students}
                columns={acceptedStudentsColumns}
                emptyMessage="هیچ پذیرفته‌شده‌ای یافت نشد"
                searchPlaceholder="جستجوی پذیرفته‌شدگان..."
              />
            </ActionLink>
            <ActionLink
              Icon={ClipboardList}
              label="لیست رشته ها"
              modalTitle="لیست رشته‌های تحصیلی"
              modalDescription="لیست کامل رشته‌های ارائه شده در این دوره"
              onClose={() => console.log("Modal closed")}
              onPrint={() => window.print()}
            >
              <GenericDataTable
                data={sampleData.fields}
                columns={majorsColumns}
                emptyMessage="هیچ رشته‌ای ثبت نشده است"
                searchPlaceholder="جستجوی رشته‌ها..."
              />
            </ActionLink>
          </section>
        </CardContent>

        <div className="flex justify-end gap-4 p-6 border-t">
          <Button
            variant="destructive"
            size="lg"
            className="px-8 py-4 text-card font-bold hover:bg-red-600"
          >
            لغو
          </Button>
          <PublishResultsModal />
        </div>
      </Card>
    </div>
  );
};

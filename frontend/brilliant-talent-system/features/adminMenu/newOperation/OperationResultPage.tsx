import { GraduationCap, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublishResultsModal } from "./PublishResultsModal";
import { UploadTableModal } from "./UploadTableModal";

const ActionLink = ({
  Icon,
  label,
  modalTitle,
}: {
  Icon: React.ElementType;
  label: string;
  modalTitle: string;
}) => (
  <UploadTableModal title={modalTitle}>
    <div className="flex cursor-pointer flex-col items-center gap-4 text-primary transition-transform hover:scale-105">
      <Icon className="h-12 w-12 text-primary/80" strokeWidth={1.5} />
      <span className="text-base font-semibold">{label}</span>
    </div>
  </UploadTableModal>
);

export const OperationResultPage = () => {
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
            />
            <ActionLink
              Icon={ClipboardList}
              label="لیست رشته ها"
              modalTitle="لیست رشته‌ها"
            />
          </section>
        </CardContent>

        <CardFooter className="justify-end gap-4">
          <Button
            variant="destructive"
            size="lg"
            className="px-8 py-4 text-card font-bold hover:bg-red-600"
          >
            لغو
          </Button>
          <PublishResultsModal />
        </CardFooter>
      </Card>
    </div>
  );
};

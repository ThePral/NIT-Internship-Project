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

// ActionLink now uses text and icon sizes from the UploadCard component
const ActionLink = ({
  Icon,
  label,
}: {
  Icon: React.ElementType;
  label: string;
}) => (
  <a
    href="#"
    className="flex flex-col items-center gap-4 text-primary transition-transform hover:scale-105"
  >
    {/* Icon size changed to h-12 w-12 */}
    <Icon className="h-12 w-12 text-primary/80" strokeWidth={1.5} />
    {/* Text size changed to text-base */}
    <span className="text-base font-semibold">{label}</span>
  </a>
);

export const OperationResultPage = () => {
  return (
    <div className="flex w-full items-center justify-center bg-background px-8 mt-2 font-primary text-foreground">
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-end text-right">
          {/* CardTitle changed to text-2xl */}
          <CardTitle className="text-2xl font-bold text-primary">
            نتیجه عملیات
          </CardTitle>
          <CardDescription className="mt-4 rounded-lg bg-success/20 px-6 py-3 text-right text-base font-medium text-green-800">
            <p>
              عملیات با موفقیت انجام شد-{" "}
              <span dir="ltr" className="font-mono">
                13:33:31 - 1404/09/09
              </span>
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <section className="flex items-center justify-right gap-24">
            <ActionLink Icon={GraduationCap} label="لیست پذیرفته شدگان" />
            <ActionLink Icon={ClipboardList} label="لیست رشته ها" />
          </section>
        </CardContent>

        <CardFooter className="justify-end gap-4">
          <Button
            size="lg"
            className="bg-red-500 px-12 py-7 text-base-100 font-bold text-primary-foreground hover:bg-danger/90"
          >
            لغو
          </Button>
          <PublishResultsModal />
        </CardFooter>
      </Card>
    </div>
  );
};

import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PriorityCardProps {
  priorityLabel: string;
  status: "success" | "error";
  title: string;
  capacity: number | string;
  rank: number | string;
  lastAccepted: number | string;
}

export default function PriorityCard({
  priorityLabel,
  status,
  title,
  capacity,
  rank,
  lastAccepted,
}: PriorityCardProps) {
  const isSuccess = status === "success";
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <Card
      className="bg-card border border-border rounded-lg shadow-sm"
      dir="rtl"
    >
      <CardContent className="p-4 sm:p-5 space-y-3 text-right">
        {/* Priority Label */}
        <div className="flex items-center gap-2">
          <Icon
            className={isSuccess ? "text-success" : "text-danger"}
            size={20}
          />
          <span
            className={`font-medium text-sm sm:text-base ${
              isSuccess ? "text-success" : "text-danger"
            }`}
          >
            {priorityLabel}
          </span>
        </div>

        {/* Title */}
        <div className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium leading-relaxed">
          {title}
        </div>

        {/* Details */}
        <div className="space-y-2">
          {[
            { label: "ظرفیت", value: capacity },
            { label: "رتبه", value: rank },
            { label: "آخرین فرد قبول شده", value: lastAccepted },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-muted px-3 py-2 rounded text-sm"
            >
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

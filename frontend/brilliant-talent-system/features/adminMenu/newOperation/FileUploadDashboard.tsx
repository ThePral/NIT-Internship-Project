'use client'
import type { LucideIcon } from "lucide-react";
import { GraduationCap, School, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadFileService } from "@/services/UploadFileService";
import { toast } from "sonner";
import useGetIsUploadeds from "@/hooks/useGetIsUploadeds";
import { UploadState } from "@/interfaces/operation";
import { AddToDB } from "@/services/AddToDB";
import { CheckAddToDB } from "@/services/CheckAddToDB";

interface UploadCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  type: string;
  hasBeenUploaded?: boolean;
}

interface JobInterface {
  jobId: string;
  state: "active" | "completed" | "failed" | "waiting";
  progress: {
    step: string;
  };
  result: any;
  failedReason: any;
}

const UploadCard = ({
  Icon,
  title,
  description,
  className,
  type,
  hasBeenUploaded
}: UploadCardProps) => {
  const queryClient = useQueryClient()
  const uploadFile = useMutation({
    mutationFn: ({ type, file }: { type: string; file: File }) => UploadFileService(type, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploadeds"] });
      console.log('successful upload')
    },
  });

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary/80 hover:bg-accent",
        className
      )}
    >
      <input type="file" onChange={(e) => e.target.files && uploadFile.mutate({ type: type, file: e.target.files[0] })} className="hidden" />
      {hasBeenUploaded && <p className="text-primary">آپلود شده</p>}
      <Icon className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
      <div className="space-y-1">
        <p className="font-semibold text-card-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </label>
  );
};

export const FileUploadDashboard = () => {
  const uploadItems: UploadCardProps[] = [
    {
      Icon: GraduationCap,
      title: "جدول دانشجویان نوشیروانی",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
      type: "students1"
    },
    {
      Icon: GraduationCap,
      title: "جدول دانشجویان دیگر دانشگاه ها",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
      type: "students2"
    },
    {
      Icon: School,
      title: "جدول دانشگاه ها",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
      type: "universities"
    },
    {
      Icon: Armchair,
      title: "جدول ظرفیت ها",
      description: "برای آپلود فایل مورد نظر را روی اینجا بکشید و رها کنید",
      type: "minors"
    },
  ];

  const { data: isUploadeds } = useGetIsUploadeds();
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobInterface | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Check for existing job on component mount
  useEffect(() => {
    const storedJobId = localStorage.getItem('currentJob');
    if (storedJobId) {
      setJobId(storedJobId);
      startPolling(storedJobId);
    }
  }, []);

  // Polling function
  const startPolling = (jobIdToPoll: string) => {
    setIsPolling(true);
    const pollInterval = setInterval(async () => {
      try {
        const jobData = await CheckAddToDB(jobIdToPoll);
        setJobStatus(jobData);
        
        if (jobData.state === "completed" || jobData.state === "failed") {
          clearInterval(pollInterval);
          setIsPolling(false);
          localStorage.removeItem('currentJob');
          setJobId(null);
          
          if (jobData.state === "completed") {
            toast.success("پردازش با موفقیت انجام شد");
          } else {
            toast.error(`پردازش ناموفق: ${jobData.failedReason || "دلیل نامشخص"}`);
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
        clearInterval(pollInterval);
        setIsPolling(false);
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  };

  const addToDB = useMutation({
    mutationFn: () => AddToDB(),
    onSuccess: (data: { message: string, jobId: string }) => {
      console.log('successful add to db', data);
      setJobId(data.jobId);
      localStorage.setItem('currentJob', data.jobId);
      startPolling(data.jobId);
    },
    onError: (error) => {
      toast.error("خطا در شروع پردازش");
      console.error("Add to DB error:", error);
    },
  });

  // Check if all required files are uploaded
  const allFilesUploaded = isUploadeds && 
    uploadItems.every(item => isUploadeds[item.type as keyof UploadState]);

  return (
    <div className="flex w-full items-center justify-center bg-background font-primary text-foreground">
      <Card className="w-full shadow-primary bg-card">
        <CardHeader className="text-right">
          <CardTitle className="text-2xl font-bold text-primary">
            عملیات جدید
          </CardTitle>
          <CardDescription className="pt-1 text-xl font-extrabold text-primary mt-4">
            آپلود جداول
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Job Status Display */}
          {jobStatus && (
            <div className="mb-6 p-4 border rounded-lg bg-muted">
              <h3 className="font-semibold text-lg mb-2">وضعیت پردازش:</h3>
              <p className="mb-1">وضعیت: {jobStatus.state}</p>
              {jobStatus.progress && (
                <p className="mb-1">مرحله: {jobStatus.progress.step}</p>
              )}
              {jobStatus.state === "active" && (
                <p className="text-primary">در حال پردازش...</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {uploadItems.map((item, index) => (
              <UploadCard
                key={index}
                Icon={item.Icon}
                title={item.title}
                description={item.description}
                type={item.type}
                hasBeenUploaded={isUploadeds ? isUploadeds[item.type as keyof UploadState] : false}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            size="lg"
            className="px-10 py-6 text-card bg-primary hover:bg-primary/90"
            onClick={() => addToDB.mutate()}
            disabled={!allFilesUploaded || isPolling || addToDB.isPending}
          >
            {addToDB.isPending ? "در حال شروع..." : 
             isPolling ? "در حال پردازش..." : "پردازش"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
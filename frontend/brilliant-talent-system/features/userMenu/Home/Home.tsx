'use client'
import { useUser } from "@/hooks";
import { ProfileCard } from "./ProfileCard";
import { ResultCard } from "./ResultCard";
import useGetStudentReport from "@/hooks/useGetSrudentReport";

export default function Home() {
  const {data:result , isLoading} = useGetStudentReport()
  return (
    <main className="h-fit bg-background flex w-full justify-center items-start p-4">
      {!isLoading && result && 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileCard
            result={result}
          />
          <ResultCard
            priority="دوم"
            acceptedMajor="مهندسی کامپیوتر هوش مصنوعی و رباتیکز - نوبت دوم - استعداد درخشان"
          />
        </div>
      }
    </main>
  );
}

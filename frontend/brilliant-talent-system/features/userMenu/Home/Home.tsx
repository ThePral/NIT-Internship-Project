import { ProfileCard } from "./ProfileCard";
import { ResultCard } from "./ResultCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col md:flex-row w-full gap-6 justify-center items-start p-6">
      <ProfileCard
        firstName="مهرداد"
        lastName="محسنی میانه"
        birthDate="۱۳۸۰/۰۱/۲۲"
        nationalId="۲۰۵۱۲۳۹۸۵۴"
        major="مهندسی کامپیوتر"
        university="دانشگاه علم و فناوری مازندران"
        degree="کارشناسی"
      />
      <ResultCard
        priority="دوم"
        acceptedMajor="مهندسی کامپیوتر هوش مصنوعی و رباتیکز - نوبت دوم - استعداد درخشان"
      />
    </main>
  );
}

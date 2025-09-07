import { ProfileCard } from "./ProfileCard";
import { ResultCard } from "./ResultCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex w-full justify-center items-start p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </main>
  );
}

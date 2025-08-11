import ClientLayout from "./clientLayout";
import "@/app/globals.css";

export default async function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={`$ antialiased `}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

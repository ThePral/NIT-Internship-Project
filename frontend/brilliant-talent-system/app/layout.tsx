"use client";
import InnerLayout from "@/layouts/InnerLayout/InnerLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/app/globals.css";

const queryClient = new QueryClient();

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={`$ antialiased `}>
        <QueryClientProvider client={queryClient}>
          <InnerLayout>{children}</InnerLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}

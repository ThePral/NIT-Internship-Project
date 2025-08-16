"use client";
import InnerLayout from "@/layouts/InnerLayout/InnerLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import "@/globals.css";

const queryClient = new QueryClient();

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const formMethods = useForm();
  return (
    <html lang="en" dir="rtl">
      <body className={`$ antialiased `}>
        {/* <FormProvider {...formMethods}> */}
        <QueryClientProvider client={queryClient}>
          <InnerLayout>{children}</InnerLayout>
        </QueryClientProvider>
        {/* </FormProvider> */}
      </body>
    </html>
  );
}

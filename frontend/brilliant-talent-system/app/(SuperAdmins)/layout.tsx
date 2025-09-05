"use client";
import InnerLayout from "@/layouts/InnerLayout/InnerLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/app/globals.css";
import SuperAdminLayout from "./SuperAdminLayout";

const queryClient = new QueryClient();

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <InnerLayout role="superAdmin">
      <SuperAdminLayout children={children} />
    </InnerLayout>
  );
}

"use client";
import InnerLayout from "@/layouts/InnerLayout/InnerLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/app/globals.css";
import UserLayout from "./Userlayout";

const queryClient = new QueryClient();

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <InnerLayout role="user">
      <UserLayout children={children} />
    </InnerLayout>
  );
}

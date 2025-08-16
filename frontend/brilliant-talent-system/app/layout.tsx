'use client'
import InnerLayout from "@/layouts/InnerLayout/InnerLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const queryClient = new QueryClient();

export default  function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
      <html lang="en" dir="rtl">
        <body className={`$ antialiased `}>
          {/* <ClientLayout generalSettings={generalSettings}> */}
          <QueryClientProvider client={queryClient}>
          <InnerLayout>{children}</InnerLayout>

          {/* {children} */}

          </QueryClientProvider>
          {/* </ClientLayout> */}
        </body>
      </html>
    );

}

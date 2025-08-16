// import { SidebarProvider } from "@/components/ui/sidebar";

// export default function AdminLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {

//   return (

//     <div className={`flex gap-5 `}>
//       <SidebarProvider>

//         <div className="md:block hidden fixed top-0 right-0">
//           <AdminSidebar/>
//         </div>
//         <div className="md:hidden flex">
//           <AdminSidebarMobile/>
//         </div>

//         <AdminNavbar/>

//         <div className="md:mr-[350] mt-20 w-full h-96 md:pl-5">
//           <Window>
//               {children}
//           </Window>
//         </div>

//       </SidebarProvider>
//     </div>
//   );
// }

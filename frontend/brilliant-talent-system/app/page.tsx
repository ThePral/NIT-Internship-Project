"use client";
import { Button } from "@/components/";
import UserNavbar from "@/components/User/UserNavbar";
import UserSidebar from "@/components/User/UserSidebar";
import Home from "@/features/userMenu/Home/Home";
import ResultCard from "@/features/userMenu/Transcript/PriorityCard";
import "@/app/globals.css";

import React from "react";
import Transcript from "@/features/userMenu/Transcript/Transcript";

const FirstPage = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <UserNavbar userName={"a"} userMajor={"b"} />

      {/* Main content area with sidebar and home */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar - hidden on mobile unless toggled (you might want to add a toggle button) */}
        <div className="w-full md:w-64 lg:w-72 fixed md:static h-full z-10">
          <UserSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-64 lg:ml-72 p-4 mt-16 md:mt-20">
          <Transcript />
        </main>
      </div>
    </div>
  );
};

export default FirstPage;

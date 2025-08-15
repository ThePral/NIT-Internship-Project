"use client";
import { Button } from "@/components/";
import UserNavbar from "@/components/User/UserNavbar";
import UserSidebar from "@/components/User/UserSidebar";
import Home from "@/features/userMenu/Home/Home";
import ResultCard from "@/features/userMenu/Transcript/PriorityCard";


import React from "react";
import Transcript from "@/features/userMenu/Transcript/Transcript";

const FirstPage = () => {
  return (
    <div className="flex-1 md:ml-64 lg:ml-72 p-4 mt-16 md:mt-20">
      <Transcript />
    </div>

  );
};

export default FirstPage;

"use client";

import React from "react";
import Transcript from "@/features/userMenu/Transcript/Transcript";
import { Home } from "lucide-react";
import NewOperation from "@/features/adminMenu/newOperation/NewOperation";
import { SuperAdminHome } from "@/features/superAdminMenu/superAdminHome/AdminHome";

const FirstPage = () => {
  return (
    <div className="flex-1 md:ml-64 lg:ml-72 p-4 mt-16 md:mt-20">
      <SuperAdminHome />
    </div>
  );
};

export default FirstPage;

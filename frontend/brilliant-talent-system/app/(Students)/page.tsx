"use client";

import React from "react";
import Transcript from "@/features/userMenu/Transcript/Transcript";
import NewOperation from "@/features/adminMenu/newOperation/NewOperation";
import { HistoryCard } from "@/features/adminMenu/history/HistoryCard";

const FirstPage = () => {
  return (
    <div className="flex-1 p-8 ">
      <HistoryCard />
    </div>
  );
};

export default FirstPage;

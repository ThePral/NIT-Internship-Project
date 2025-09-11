"use client";

import { useState } from "react";
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "../ui/responsiveModal";
import { Button } from "../ui/button";
import { ChevronLeft, Edit, GraduationCap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { EditMyPasswordService } from "@/services/EditMyPasswordService";
import AcceptedHistoryTable from "./AcceptedHistoryTable";


interface AcceptedHistoryModalProps {
  isOpen: boolean;
  onOpen: (sth: boolean) => void;
  id:number
}

const AcceptedHistoryModal = ({
  isOpen,
  onOpen,
  id
}: AcceptedHistoryModalProps) => {


  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpen}>
      <ResponsiveModalTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-2">
          <ChevronLeft size={16} />
            مشاهده نتایج دانشجویان
        </Button>
      </ResponsiveModalTrigger>

      <ResponsiveModalContent
        position="center"
        className="bg-card border-border"
      >
        <ResponsiveModalHeader className="border-border">
          <ResponsiveModalTitle className="text-xl sm:text-2xl text-right text-foreground">
            جدول قبولی ها
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>
        
        <AcceptedHistoryTable id={id}/>
       
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default AcceptedHistoryModal;

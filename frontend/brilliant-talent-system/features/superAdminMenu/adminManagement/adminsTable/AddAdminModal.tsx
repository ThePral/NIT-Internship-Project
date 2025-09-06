"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (adminData: { first_name: string; last_name: string }) => void;
}

export default function AddAdminModal({
  isOpen,
  onClose,
  onAddAdmin,
}: AddAdminModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddAdmin({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      setFirstName("");
      setLastName("");
      onClose();
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            افزودن ادمین جدید
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0 "
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">
              نام
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="نام ادمین"
              className="w-full"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">
              نام خانوادگی
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="نام خانوادگی ادمین"
              className="w-full"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-card"
              disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
            >
              {isSubmitting ? "در حال افزودن..." : "افزودن ادمین"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

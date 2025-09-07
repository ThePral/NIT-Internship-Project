"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Admin {
  id: number;
  first_name: string;
  last_name: string;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditAdmin: (adminData: {
    id: number;
    first_name: string;
    last_name: string;
  }) => void;
  admin: Admin | null;
}

export default function EditAdminModal({
  isOpen,
  onClose,
  onEditAdmin,
  admin,
}: EditAdminModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form fields when admin data changes
  useEffect(() => {
    if (admin) {
      setFirstName(admin.first_name);
      setLastName(admin.last_name);
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !admin) return;

    setIsSubmitting(true);
    try {
      await onEditAdmin({
        id: admin.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Error editing admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setFirstName(admin?.first_name || "");
    setLastName(admin?.last_name || "");
    onClose();
  };

  if (!isOpen || !admin) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">ویرایش ادمین</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editFirstName" className="text-foreground">
              نام
            </Label>
            <Input
              id="editFirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="نام ادمین"
              className="w-full bg-background border-border focus:ring-2 focus:ring-primary/20"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editLastName" className="text-foreground">
              نام خانوادگی
            </Label>
            <Input
              id="editLastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="نام خانوادگی ادمین"
              className="w-full bg-background border-border focus:ring-2 focus:ring-primary/20"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-border hover:bg-muted"
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting || !firstName.trim() || !lastName.trim()}
            >
              {isSubmitting ? "در حال ویرایش..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  student_id: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (userData: {
    id: number;
    first_name: string;
    last_name: string;
    student_id: string;
  }) => void;
  user: User | null;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onEditUser,
  user,
}: EditUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setStudentId(user.student_id);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !studentId.trim() || !user)
      return;

    setIsSubmitting(true);
    try {
      await onEditUser({
        id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        student_id: studentId.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Error editing user:", error);
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
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setStudentId(user.student_id);
    }
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">ویرایش دانشجو</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-200"
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
              placeholder="نام دانشجو"
              className="w-full"
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
              placeholder="نام خانوادگی دانشجو"
              className="w-full"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editStudentId" className="text-foreground">
              شماره دانشجویی
            </Label>
            <Input
              id="editStudentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="شماره دانشجویی"
              className="w-full"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="flex-1 text-card bg-primary hover:bg-primary/90"
              disabled={
                isSubmitting ||
                !firstName.trim() ||
                !lastName.trim() ||
                !studentId.trim()
              }
            >
              {isSubmitting ? "در حال ویرایش..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

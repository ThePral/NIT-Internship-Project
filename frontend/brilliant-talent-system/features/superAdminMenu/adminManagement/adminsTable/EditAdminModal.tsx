"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Admin {
  id: number;
  username: string;
  password?: string;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditAdmin: (adminData: {
    id: number;
    username: string;
    password?: string;
  }) => void;
  admin: Admin | null;
}

export default function EditAdminModal({
  isOpen,
  onClose,
  onEditAdmin,
  admin,
}: EditAdminModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form fields when admin data changes
  useEffect(() => {
    if (admin) {
      setUsername(admin.username);
      setPassword(admin.password || "");
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !admin) return;

    setIsSubmitting(true);
    try {
      await onEditAdmin({
        id: admin.id,
        username: username.trim(),
        password: password.trim(),
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
    setUsername(admin?.username || "");
    setPassword(admin?.password || "");
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
            <Label htmlFor="editUsername" className="text-foreground">
              نام
            </Label>
            <Input
              id="editUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام ادمین"
              className="w-full bg-background border-border focus:ring-2 focus:ring-primary/20"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editPassword" className="text-foreground">
            رمز ادمین
            </Label>
            <Input
              id="editPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز ادمین"
              className="w-full bg-background border-border focus:ring-2 focus:ring-primary/20"
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
              disabled={isSubmitting || !username.trim() }
            >
              {isSubmitting ? "در حال ویرایش..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

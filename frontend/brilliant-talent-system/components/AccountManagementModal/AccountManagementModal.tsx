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

interface AccountManagementModalProps {
  role: "user" | "admin" | "superadmin";
  isOpen: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
}

const AccountManagementModal = ({
  role,
  isOpen,
  onClose,
  trigger,
}: AccountManagementModalProps) => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    if (formData.new_password !== formData.confirm_password) {
      setMessage({
        text: "رمزهای عبور جدید با هم مطابقت ندارند",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setMessage({
        text: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage({ text: "رمز عبور با موفقیت به روز شد", type: "success" });
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ text: "خطایی رخ داده است", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const getTitle = () => {
    switch (role) {
      case "admin":
        return "تغییر رمز ادمین";
      case "superadmin":
        return "تغییر رمز مدیر";
      default:
        return "تغییر رمز دانشجو";
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <ResponsiveModalTrigger asChild>{trigger} ubhbhhubuhybhubuhy</ResponsiveModalTrigger>
      )}

      <ResponsiveModalContent
        position="center"
        size="md"
        className="max-h-[85vh] overflow-y-auto bg-card border-border"
      >
        <ResponsiveModalHeader className="border-border">
          <ResponsiveModalTitle className="text-xl sm:text-2xl text-right text-foreground">
            {getTitle()}
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="text-right text-muted-foreground">
            برای تغییر رمز عبور، اطلاعات زیر را تکمیل کنید.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <form onSubmit={handleSubmit} className="mt-4 px-6 pb-6 pt-3">
          <div className="mb-4">
            <label
              htmlFor="current_password"
              className="block text-sm sm:text-base font-medium text-foreground mb-1 text-right"
            >
              رمز عبور فعلی
            </label>
            <input
              type="password"
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
              placeholder="رمز عبور فعلی را وارد کنید"
              dir="rtl"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="new_password"
              className="block text-sm sm:text-base font-medium text-foreground mb-1 text-right"
            >
              رمز عبور جدید
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
              placeholder="رمز عبور جدید را وارد کنید"
              dir="rtl"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirm_password"
              className="block text-sm sm:text-base font-medium text-foreground mb-1 text-right"
            >
              تأیید رمز عبور جدید
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
              placeholder="رمز عبور جدید را تأیید کنید"
              dir="rtl"
            />
          </div>

          {message.text && (
            <div
              className={`p-3 rounded-md text-sm sm:text-base mb-4 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <ResponsiveModalFooter className="mt-6 gap-2 sm:gap-0 border-t border-border pt-4">
            <ResponsiveModalClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-initial border-border hover:bg-muted"
              >
                انصراف
              </Button>
            </ResponsiveModalClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 mr-2 sm:flex-initial bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "در حال به روزرسانی..." : "به روزرسانی رمز عبور"}
            </Button>
          </ResponsiveModalFooter>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default AccountManagementModal;

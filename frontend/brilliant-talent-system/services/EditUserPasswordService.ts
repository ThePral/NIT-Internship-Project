import { APIURL } from "@/data/consts";
import { updateFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function EditUserPasswordService(
  id: number,
  formData: {
    new_password?: string;
    username?: string;
  },
  mode: "user" | "admin"
) {
  const finalData: {
    new_password?: string;
    username?: string;
  } = {};

  if (formData.username) {
    finalData.username = formData.username;
  }
  if (formData.new_password) {
    finalData.new_password = formData.new_password;
  }

  const result = await updateFetch(
    APIURL +
      (mode == "user" ? `admins/users/${id}` : `superAdmins/admins/${id}`),
    JSON.stringify(finalData),
    "PATCH"
  );

  const jsonResult = await result.json();

  if (result.ok) {
    toast.success("اطلاعات با موفقیت بروزرسانی شد", {
      description:
        formData.new_password && formData.username
          ? "رمز عبور و نام کاربری با موفقیت تغییر یافتند."
          : formData.new_password
          ? "رمز عبور با موفقیت تغییر یافت."
          : "نام کاربری با موفقیت تغییر یافت.",
    });
    return jsonResult;
  } else {
    // Handle different error status codes
    switch (result.status) {
      case 400:
        toast.error("خطای درخواست", {
          description: jsonResult.message || "اطلاعات وارد شده نامعتبر است.",
        });
        break;
      case 401:
        toast.error("عدم دسترسی", {
          description: "شما مجوز ویرایش این کاربر را ندارید.",
        });
        break;
      case 403:
        toast.error("ممنوع", {
          description: "امکان انجام این عملیات وجود ندارد.",
        });
        break;
      case 404:
        toast.error("یافت نشد", {
          description: "کاربر یا ادمین مورد نظر یافت نشد.",
        });
        break;
      case 409:
        toast.error("تضاد", {
          description:
            "نام کاربری انتخاب‌شده قبلاً توسط کاربر دیگری ثبت شده است.",
        });
        break;
      case 500:
        toast.error("خطای سرور", {
          description: "مشکلی در سرور رخ داده است. لطفاً بعداً تلاش کنید.",
        });
        break;
      default:
        toast.error("خطای ناشناخته", {
          description: jsonResult.error || "خطای نامشخصی رخ داده است.",
        });
    }
    throw new Error(jsonResult.error || "خطای نامشخص");
  }
}

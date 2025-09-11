import { APIURL } from "@/data/consts";
import { User } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetUsersService(): Promise<User[]> {
  try {
    const result = await getFetch(APIURL + `admins/users`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log(jsonResult, "لیست کاربران با موفقیت دریافت شد");
      return jsonResult;
    }

    // Only show one toast based on status
    let message = "مشکلی در دریافت لیست کاربران رخ داده است.";
    switch (result.status) {
      case 400:
        message =
          jsonResult.message || "درخواست نامعتبر برای دریافت لیست کاربران.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده لیست کاربران باید وارد حساب کاربری خود شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به لیست کاربران را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ کاربری در سیستم یافت نشد.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکلی در دریافت لیست کاربران رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت لیست کاربران رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت لیست کاربران:", error);
    throw error;
  }
}

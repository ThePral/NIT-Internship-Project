import { APIURL } from "@/data/consts";
import { Admin } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetAdmins(): Promise<Admin[]> {
  try {
    const result = await getFetch(APIURL + `superAdmins/admins`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("لیست ادمین‌ها با موفقیت دریافت شد", jsonResult);
      return jsonResult;
    }

    let message = "مشکلی در دریافت لیست ادمین‌ها رخ داده است.";

    switch (result.status) {
      case 400:
        message =
          jsonResult.message || "درخواست نامعتبر برای دریافت لیست ادمین‌ها.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده لیست ادمین‌ها باید وارد حساب کاربری شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به لیست ادمین‌ها را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ ادمینی در سیستم یافت نشد.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکل در دریافت لیست ادمین‌ها رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت لیست ادمین‌ها رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت لیست ادمین‌ها:", error);
    throw error;
  }
}

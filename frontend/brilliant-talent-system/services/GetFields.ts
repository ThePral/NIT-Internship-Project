import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetFields() {
  try {
    const result = await getFetch(APIURL + `majors`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("لیست رشته‌ها با موفقیت دریافت شد", jsonResult);
      return jsonResult;
    }

    let message = "مشکلی در دریافت لیست رشته‌ها رخ داده است.";

    switch (result.status) {
      case 400:
        message =
          jsonResult.message || "درخواست نامعتبر برای دریافت لیست رشته‌ها.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده لیست رشته‌ها باید وارد حساب کاربری خود شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به لیست رشته‌ها را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ رشته‌ای در سیستم ثبت نشده است.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکل در دریافت لیست رشته‌ها رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت لیست رشته‌ها رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت لیست رشته‌ها:", error);
    throw error;
  }
}

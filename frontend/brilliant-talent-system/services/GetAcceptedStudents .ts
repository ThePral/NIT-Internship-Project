import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetAcceptedStudents() {
  try {
    const result = await getFetch(APIURL + `admins/results/table`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("لیست پذیرفته‌شدگان با موفقیت دریافت شد", jsonResult);
      return jsonResult;
    }

    let message = "مشکلی در دریافت نتایج پذیرش رخ داده است.";

    switch (result.status) {
      case 400:
        message =
          jsonResult.message ||
          "درخواست نامعتبر برای دریافت لیست پذیرفته‌شدگان.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده لیست پذیرفته‌شدگان باید وارد حساب کاربری شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به لیست پذیرفته‌شدگان را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "لیست پذیرفته‌شدگان هنوز منتشر نشده است.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکل در پردازش لیست پذیرفته‌شدگان.";
        toast.error("تضاد داده", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت لیست نهایی پذیرفته‌شدگان رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت لیست پذیرفته‌شدگان:", error);
    throw error;
  }
}

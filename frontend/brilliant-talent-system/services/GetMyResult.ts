import { APIURL } from "@/data/consts";
import { StudentResult } from "@/interfaces/operation";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetStudentResult(): Promise<StudentResult> {
  try {
    const result = await getFetch(APIURL + `users/result`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("نتایج با موفقیت دریافت شد", jsonResult);
      return jsonResult;
    }

    // Default error message
    let message = "مشکلی در دریافت نتایج رخ داده است.";

    switch (result.status) {
      case 400:
        message = jsonResult.message || "درخواست نامعتبر برای دریافت نتایج.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده نتایج باید وارد حساب کاربری شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به نتایج را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ نتیجه‌ای در سیستم یافت نشد.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکلی در دریافت نتایج رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت نتایج رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت نتایج:", error);
    throw error;
  }
}

import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetTranscripts() {
  try {
    const result = await getFetch(APIURL + `transcripts`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("کارنامه‌ها با موفقیت دریافت شدند", jsonResult);
      return jsonResult;
    }

    // Default error message
    let message = "مشکلی در دریافت کارنامه‌ها رخ داده است.";

    switch (result.status) {
      case 400:
        message =
          jsonResult.message || "درخواست نامعتبر برای دریافت کارنامه‌ها.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده کارنامه‌ها باید وارد حساب کاربری خود شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به کارنامه‌ها را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "کارنامه‌ای برای نمایش وجود ندارد.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکلی در پردازش کارنامه‌ها رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت کارنامه‌ها رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت کارنامه‌ها:", error);
    throw error;
  }
}

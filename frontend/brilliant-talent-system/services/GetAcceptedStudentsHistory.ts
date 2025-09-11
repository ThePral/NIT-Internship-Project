import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetAcceptedStudentsHistory(id: number) {
  try {
    const result = await getFetch(APIURL + `admins/history/allocation/${id}`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("لیست سوابق با موفقیت دریافت شد", jsonResult);
      return jsonResult;
    }

    let message = "مشکلی در دریافت سوابق رخ داده است.";

    switch (result.status) {
      case 400:
        message = jsonResult.message || "درخواست نامعتبر برای دریافت سوابق.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده سوابق باید وارد حساب کاربری شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به سوابق را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ سابقه‌ای یافت نشد.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکلی در دریافت سوابق رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت سوابق رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت سوابق:", error);
    throw error;
  }
}

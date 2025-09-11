import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetRules() {
  try {
    const result = await getFetch(APIURL + `rules`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("قوانین با موفقیت دریافت شدند", jsonResult);
      return jsonResult;
    }

    // Default error message
    let message = "مشکلی در دریافت قوانین رخ داده است.";

    switch (result.status) {
      case 400:
        message = jsonResult.message || "درخواست نامعتبر است.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "لطفاً ابتدا وارد حساب کاربری خود شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "دسترسی به قوانین ممنوع است.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ قانونی یافت نشد.";
        toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "تضاد در دریافت قوانین.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت قوانین رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }

    throw new Error(message);
  } catch (error) {
    console.error("خطا در دریافت قوانین:", error);
    throw error;
  }
}

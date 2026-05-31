import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetAcceptedStudentsHistory(cycleID: number) {
  try {
    const result = await getFetch(APIURL + `admins/results/table/${cycleID}`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log("لیست قبولی ها با موفقیت دریافت شد", jsonResult);
      return jsonResult;
    }

    let message = "مشکلی در دریافت قبولی ها رخ داده است.";

    switch (result.status) {
      case 400:
        message = jsonResult.message || "درخواست نامعتبر برای دریافت قبولی ها.";
        toast.error("خطای درخواست", { description: message });
        break;
      case 401:
        message = "برای مشاهده قبولی ها باید وارد حساب کاربری شوید.";
        toast.error("عدم دسترسی", { description: message });
        break;
      case 403:
        message = "شما مجوز دسترسی به قبولی ها را ندارید.";
        toast.error("ممنوع", { description: message });
        break;
      case 404:
        message = "هیچ سابقه‌ای یافت نشد.";
        // toast.error("یافت نشد", { description: message });
        break;
      case 409:
        message = "مشکلی در دریافت قبولی ها رخ داده است.";
        toast.error("تضاد", { description: message });
        break;
      case 500:
        message = "خطایی در دریافت قبولی ها رخ داده است.";
        toast.error("خطای سرور", { description: message });
        break;
      default:
        message = jsonResult.error || message;
        toast.error("خطای ناشناخته", { description: message });
    }


  } catch (error) {
    console.error("خطا در دریافت قبولی ها:", error);
    throw error;
  }
}

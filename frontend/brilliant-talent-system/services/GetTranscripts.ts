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
    } else {
      switch (result.status) {
        case 400:
          toast.error("خطای درخواست", {
            description:
              jsonResult.message || "درخواست نامعتبر برای دریافت کارنامه‌ها",
          });
          break;
        case 401:
          toast.error("عدم دسترسی", {
            description:
              "برای مشاهده کارنامه‌ها باید وارد حساب کاربری خود شوید",
          });
          break;
        case 403:
          toast.error("ممنوع", {
            description: "شما مجوز دسترسی به کارنامه‌ها را ندارید",
          });
          break;
        case 404:
          toast.error("یافت نشد", {
            description: "کارنامه‌ای برای نمایش وجود ندارد",
          });
          break;
        case 409:
          toast.error("تضاد داده", {
            description: "مشکل در پردازش کارنامه‌ها",
          });
          break;
        case 500:
          toast.error("خطای سرور", {
            description: "خطایی در دریافت کارنامه‌ها رخ داده است",
          });
          break;
        default:
          toast.error("خطای ناشناخته", {
            description:
              jsonResult.error || "خطایی در دریافت کارنامه‌ها رخ داده است",
          });
      }
      throw new Error(jsonResult.error || "خطا در دریافت کارنامه‌ها");
    }
  } catch (error) {
    console.error("خطا در دریافت کارنامه‌ها:", error);
    toast.error("خطا", {
      description: "خطایی در دریافت کارنامه‌ها رخ داده است",
    });
    throw error;
  }
}

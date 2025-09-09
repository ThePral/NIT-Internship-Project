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
    } else {
      switch (result.status) {
        case 400:
          toast.error("خطای درخواست", {
            description:
              jsonResult.message ||
              "درخواست نامعتبر برای دریافت لیست پذیرفته‌شدگان",
          });
          break;
        case 401:
          toast.error("عدم دسترسی", {
            description:
              "برای مشاهده لیست پذیرفته‌شدگان باید وارد حساب کاربری خود شوید",
          });
          break;
        case 403:
          toast.error("ممنوع", {
            description: "شما مجوز دسترسی به لیست پذیرفته‌شدگان را ندارید",
          });
          break;
        case 404:
          toast.error("یافت نشد", {
            description: "لیست پذیرفته‌شدگان هنوز منتشر نشده است",
          });
          break;
        case 409:
          toast.error("تضاد داده", {
            description: "مشکل در پردازش لیست پذیرفته‌شدگان",
          });
          break;
        case 500:
          toast.error("خطای سرور", {
            description: "خطایی در دریافت لیست نهایی پذیرفته‌شدگان رخ داده است",
          });
          break;
        default:
          toast.error("خطای ناشناخته", {
            description:
              jsonResult.error || "خطایی در دریافت نتایج پذیرش رخ داده است",
          });
      }
      throw new Error(jsonResult.error || "خطا در دریافت لیست پذیرفته‌شدگان");
    }
  } catch (error) {
    console.error("خطا در دریافت لیست پذیرفته‌شدگان:", error);
    toast.error("خطا", {
      description: "خطایی در دریافت نتایج نهایی پذیرش رخ داده است",
    });
    throw error;
  }
}

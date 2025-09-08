import { APIURL } from "@/data/consts";
import { Admin } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetAdmins(): Promise<Admin[]> {
  try {
    const result = await getFetch(APIURL + `superAdmins/admins`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log(jsonResult, "لیست ادمین‌ها با موفقیت دریافت شد");
      return jsonResult;
    } else {
      switch (result.status) {
        case 400:
          toast.error("خطای درخواست", {
            description:
              jsonResult.message ||
              "درخواست نامعتبر برای دریافت لیست ادمین‌ها.",
          });
          break;
        case 401:
          toast.error("عدم دسترسی", {
            description:
              "برای مشاهده لیست ادمین‌ها باید وارد حساب کاربری شوید.",
          });
          break;
        case 403:
          toast.error("ممنوع", {
            description: "شما مجوز دسترسی به لیست ادمین‌ها را ندارید.",
          });
          break;
        case 404:
          toast.error("یافت نشد", {
            description: "هیچ ادمینی در سیستم یافت نشد.",
          });
          break;
        case 409:
          toast.error("تضاد", {
            description: "مشکل در دریافت لیست ادمین‌ها رخ داده است.",
          });
          break;
        case 500:
          toast.error("خطای سرور", {
            description: "خطایی در دریافت لیست ادمین‌ها رخ داده است.",
          });
          break;
        default:
          toast.error("خطای ناشناخته", {
            description:
              jsonResult.error || "خطایی در دریافت لیست ادمین‌ها رخ داده است.",
          });
      }
      throw new Error(jsonResult.error);
    }
  } catch (error) {
    console.error("خطا در دریافت لیست ادمین‌ها:", error);
    toast.error("خطا", {
      description: "مشکلی در دریافت لیست ادمین‌ها رخ داده است.",
    });
    throw error;
  }
}

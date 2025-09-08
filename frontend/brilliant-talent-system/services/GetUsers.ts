import { APIURL } from "@/data/consts";
import { User } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetUsersService(): Promise<User[]> {
  try {
    const result = await getFetch(APIURL + `admins/users`);
    const jsonResult = await result.json();

    if (result.ok) {
      console.log(jsonResult, "لیست کاربران با موفقیت دریافت شد");
      return jsonResult;
    } else {
      switch (result.status) {
        case 400:
          toast.error("خطای درخواست", {
            description:
              jsonResult.message || "درخواست نامعتبر برای دریافت لیست کاربران.",
          });
          break;
        case 401:
          toast.error("عدم دسترسی", {
            description:
              "برای مشاهده لیست کاربران باید وارد حساب کاربری خود شوید.",
          });
          break;
        case 403:
          toast.error("ممنوع", {
            description: "شما مجوز دسترسی به لیست کاربران را ندارید.",
          });
          break;
        case 404:
          toast.error("یافت نشد", {
            description: "هیچ کاربری در سیستم یافت نشد.",
          });
          break;
        case 409:
          toast.error("تضاد", {
            description: "مشکلی در دریافت لیست کاربران رخ داده است.",
          });
          break;
        case 500:
          toast.error("خطای سرور", {
            description: "خطایی در دریافت لیست کاربران رخ داده است.",
          });
          break;
        default:
          toast.error("خطای ناشناخته", {
            description:
              jsonResult.error || "خطایی در دریافت لیست کاربران رخ داده است.",
          });
      }
      throw new Error(jsonResult.error);
    }
  } catch (error) {
    console.error("خطا در دریافت لیست کاربران:", error);
    toast.error("خطا", {
      description: "مشکلی در دریافت لیست کاربران رخ داده است.",
    });
    throw error;
  }
}

import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetTestService() {
  try {
    const result = await getFetch(APIURL + `reviews/user?limit=10&offset=0`);
    const jsonResult = await result.json();
    if (result.ok) {
      console.log(jsonResult, "success");

      return jsonResult;
    } else {
      switch (result.status) {
        case 400:
          toast.error("خطای درخواست", {
            description: jsonResult.message || "درخواست نامعتبر است",
          });
          break;
        case 401:
          toast.error("عدم دسترسی", {
            description: "لطفاً ابتدا وارد حساب کاربری خود شوید",
          });
          break;
        case 403:
          toast.error("ممنوع", {
            description: "دسترسی به این عملیات ممنوع است",
          });
          break;
        case 404:
          toast.error("یافت نشد", { description: "نظری یافت نشد" });
          break;
        case 409:
          toast.error("تضاد", { description: "این نظر قبلاً ثبت شده است" });
          break;
        case 500:
          toast.error("خطای سرور", {
            description: "خطایی در دریافت نظرات رخ داده است",
          });
          break;
        default:
          toast.error("خطای ناشناخته", {
            description:
              jsonResult.error || "خطایی در دریافت نظرات رخ داده است",
          });
      }
      throw new Error(jsonResult.error);
    }
  } catch (error) {
    console.error("Error getting reviews:", error);
    toast.error("خطا", { description: "خطایی در دریافت نظرات رخ داده است" });
    throw error;
  }
}

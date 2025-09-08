import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetIsUploadeds() {
    try {
        const result = await getFetch(APIURL + `admins/excels`);
        const jsonResult = await result.json();

        if (result.ok) {
            console.log(jsonResult, "آپلودها  با موفقیت دریافت شد");
            return jsonResult;
        } else {
            switch (result.status) {
                case 400:
                    toast.error("خطای درخواست", {
                        description:
                            jsonResult.message || "درخواست نامعتبر برای دریافت آپلودها ",
                    });
                    break;
                case 401:
                    toast.error("عدم دسترسی", {
                        description:
                            "برای مشاهده آپلودها  باید وارد حساب کاربری خود شوید",
                    });
                    break;
                case 403:
                    toast.error("ممنوع", {
                        description: "شما مجوز دسترسی به آپلودها  را ندارید",
                    });
                    break;
                case 404:
                    toast.error("یافت نشد", {
                        description: "هیچ رشته‌ای در سیستم ثبت نشده است",
                    });
                    break;
                case 409:
                    toast.error("تضاد", {
                        description: "مشکل در دریافت آپلودها ",
                    });
                    break;
                case 500:
                    toast.error("خطای سرور", {
                        description: "خطایی در دریافت آپلودها رخ داده است",
                    });
                    break;
                default:
                    toast.error("خطای ناشناخته", {
                        description:
                            jsonResult.error || "خطایی در دریافت آپلودها  رخ داده است",
                    });
            }
            throw new Error(jsonResult.error);
        }
    } catch (error) {
        console.error("خطا در دریافت آپلودها :", error);
        toast.error("خطا", {
            description: "خطایی در دریافت آپلودها رخ داده است",
        });
        throw error;
    }
}

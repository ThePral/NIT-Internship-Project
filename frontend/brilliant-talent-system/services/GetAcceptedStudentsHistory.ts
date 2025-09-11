import { APIURL } from "@/data/consts";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetAcceptedStudentsHistory(id: number) {
    try {
        const result = await getFetch(APIURL + `admins/history/allocation/` + id); // بررسی کن که endpoint درست باشه
        const jsonResult = await result.json();

        if (result.ok) {
            console.log(jsonResult, "لیست سوابق با موفقیت دریافت شد");
            return jsonResult;
        } else {
            switch (result.status) {
                case 400:
                    toast.error("خطای درخواست", {
                        description:
                            jsonResult.message || "درخواست نامعتبر برای دریافت سوابق.",
                    });
                    break;
                case 401:
                    toast.error("عدم دسترسی", {
                        description: "برای مشاهده سوابق باید وارد حساب کاربری شوید.",
                    });
                    break;
                case 403:
                    toast.error("ممنوع", {
                        description: "شما مجوز دسترسی به سوابق را ندارید.",
                    });
                    break;
                case 404:
                    toast.error("یافت نشد", {
                        description: "هیچ سابقه‌ای یافت نشد.",
                    });
                    break;
                case 409:
                    toast.error("تضاد", {
                        description: "مشکلی در دریافت سوابق رخ داده است.",
                    });
                    break;
                case 500:
                    toast.error("خطای سرور", {
                        description: "خطایی در دریافت سوابق رخ داده است.",
                    });
                    break;
                default:
                    toast.error("خطای ناشناخته", {
                        description:
                            jsonResult.error || "خطایی در دریافت سوابق رخ داده است.",
                    });
            }
            throw new Error(jsonResult.error);
        }
    } catch (error) {
        console.error("خطا در دریافت سوابق:", error);
        toast.error("خطا", {
            description: "مشکلی در دریافت سوابق رخ داده است.",
        });
        throw error;
    }
}

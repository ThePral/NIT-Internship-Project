import { APIURL } from "@/data/consts";
import { StudentReport } from "@/interfaces/operation";
import { getFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function GetStudentReport(): Promise<StudentReport> {
    try {
        const result = await getFetch(APIURL + `users/result`);
        const jsonResult = await result.json();

        if (result.ok) {
            console.log(jsonResult, "نتایج با موفقیت دریافت شد");
            return jsonResult;
        } else {
            switch (result.status) {
                case 400:
                    toast.error("خطای درخواست", {
                        description:
                            jsonResult.message ||
                            "درخواست نامعتبر برای دریافت نتایج.",
                    });
                    break;
                case 401:
                    toast.error("عدم دسترسی", {
                        description:
                            "برای مشاهده نتایج باید وارد حساب کاربری شوید.",
                    });
                    break;
                case 403:
                    toast.error("ممنوع", {
                        description: "شما مجوز دسترسی به نتایج را ندارید.",
                    });
                    break;
                case 404:
                    toast.error("یافت نشد", {
                        description: "هیچ ادمینی در سیستم یافت نشد.",
                    });
                    break;
                case 409:
                    toast.error("تضاد", {
                        description: "مشکل در دریافت نتایج رخ داده است.",
                    });
                    break;
                case 500:
                    toast.error("خطای سرور", {
                        description: "خطایی در دریافت نتایج رخ داده است.",
                    });
                    break;
                default:
                    toast.error("خطای ناشناخته", {
                        description:
                            jsonResult.error || "خطایی در دریافت نتایج رخ داده است.",
                    });
            }
            throw new Error(jsonResult.error);
        }
    } catch (error) {
        console.error("خطا در دریافت نتایج:", error);
        toast.error("خطا", {
            description: "مشکلی در دریافت نتایج رخ داده است.",
        });
        throw error;
    }
}

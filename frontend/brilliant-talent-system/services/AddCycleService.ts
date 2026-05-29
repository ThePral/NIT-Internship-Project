import { APIURL } from "@/data/consts";
import { postFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function AddCycleService(name: string) {
    const result = await postFetch(
        APIURL + `cycle`,
        JSON.stringify({ name }));

    const jsonResult = await result.json();

    if (result.ok) {
        toast.success("دوره با موفقیت اضافه شد", {
            description: "دوره جدید با موفقیت ثبت گردید.",
        });
        return jsonResult;
    } else {
        // Handle different error status codes
        switch (result.status) {
            case 400:
                toast.error("خطای درخواست", {
                    description: jsonResult.message || "اطلاعات وارد شده نامعتبر است.",
                });
                break;
            case 401:
                toast.error("عدم دسترسی", {
                    description: "شما مجوز افزودن دوره جدید را ندارید.",
                });
                break;
            case 403:
                toast.error("ممنوع", {
                    description: "امکان انجام این عملیات وجود ندارد.",
                });
                break;
            case 404:
                toast.error("یافت نشد", {
                    description: "مسیر یا سرویس افزودن دوره یافت نشد.",
                });
                break;
            case 409:
                toast.error("تضاد", {
                    description: "این نام کاربری قبلاً برای یک دوره ثبت شده است.",
                });
                break;
            case 500:
                toast.error("خطای سرور", {
                    description: "مشکلی در سرور رخ داده است. لطفاً بعداً تلاش کنید.",
                });
                break;
            default:
                toast.error("خطای ناشناخته", {
                    description: jsonResult.error || "خطای نامشخصی رخ داده است.",
                });
        }
        throw new Error(jsonResult.error || "خطای نامشخص");
    }
}

import { APIURL } from "@/data/consts";
import { postFetch, updateFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function UploadFileService(
    type: string,
    file: File
) {

    const formData = new FormData();
    formData.append("file", file);
    const result = await postFetch(
        APIURL + "admins/upload/" + type, formData
    );

    const jsonResult = await result.json();

    if (result.ok) {
        toast.success("آپلود با موفقیت انجام شد", {
            description: "آپلود" + type + "با موفقیت انجام شد",
        });
        return jsonResult;
    } else {
        // Handle different error status codes
        switch (result.status) {
            case 400:
                toast.error("خطای درخواست", {
                    description:
                        jsonResult.message || "فایل نامعتبر است.",
                });
                break;
            case 401:
                toast.error("عدم احراز هویت");
                break;
            case 403:
                toast.error("حساب غیرفعال", {
                    description: "حساب کاربری شما غیرفعال شده است.",
                });
                break;
            case 404:
                toast.error("کاربر یافت نشد", {
                    description: "کاربری با این مشخصات وجود ندارد.",
                });
                break;
            case 409:
                toast.error("حساب قفل شده", {
                    description: "حساب شما به دلیل تلاشهای ناموفق متعدد قفل شده است.",
                });
                break;
            case 500:
                toast.error("خطای سرور", {
                    description: "خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید.",
                });
                break;
            default:
                toast.error("خطای ناشناخته", {
                    description:
                        jsonResult.error || "خطای نامشخصی در هنگام ورود رخ داده است.",
                });
        }
        throw new Error(jsonResult.error || "خطای نامشخص");
    }
}

import { APIURL } from "@/data/consts";
import { deleteFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function DeleteAdminService(id: number) {
  const result = await deleteFetch(APIURL + `superAdmins/admins/${id}`);

  const jsonResult = await result.json();

  if (result.ok) {
    toast.success("ادمین با موفقیت حذف شد", {
      description: "ادمین انتخاب‌شده با موفقیت از سیستم حذف گردید.",
    });
    return jsonResult;
  } else {
    // Handle different error status codes
    switch (result.status) {
      case 400:
        toast.error("خطای درخواست", {
          description: jsonResult.message || "شناسه ادمین نامعتبر است.",
        });
        break;
      case 401:
        toast.error("عدم دسترسی", {
          description: "شما مجوز حذف ادمین را ندارید.",
        });
        break;
      case 403:
        toast.error("ممنوع", {
          description: "امکان انجام عملیات حذف وجود ندارد.",
        });
        break;
      case 404:
        toast.error("یافت نشد", {
          description: "ادمین مورد نظر یافت نشد.",
        });
        break;
      case 409:
        toast.error("تضاد", {
          description:
            "امکان حذف این ادمین وجود ندارد (ادمین در حال استفاده است).",
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

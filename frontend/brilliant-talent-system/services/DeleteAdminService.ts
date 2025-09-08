import { APIURL } from "@/data/consts";
import { deleteFetch, postFetch, updateFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function DeleteAdminService(id: number) {
  const result = await deleteFetch(
    APIURL +`superAdmins/admins/${id}`
  );

  const jsonResult = await result.json();

  if (result.ok) {
    toast.success("آدرس با موفقیت اضافه شد", {
      description: "آدرس جدید شما با موفقیت ثبت گردید",
    });
    return jsonResult;
  } else {
    // Handle different error status codes
    switch (result.status) {
      case 400:
        toast.error("خطای درخواست", {
          description: jsonResult.message || "درخواست نامعتبر است.",
        });
        break;
      case 401:
        toast.error("عدم دسترسی", {
          description: "شما مجوز انجام این عمل را ندارید.",
        });
        break;
      case 403:
        toast.error("ممنوع", {
          description: "دسترسی به این عملیات ممنوع است.",
        });
        break;
      case 404:
        toast.error("یافت نشد", {
          description: "منبع درخواستی یافت نشد.",
        });
        break;
      case 409:
        toast.error("تضاد", {
          description: "این آدرس قبلاً ثبت شده است.",
        });
        break;
      case 500:
        toast.error("خطای سرور", {
          description: "خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید.",
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

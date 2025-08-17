import { APIURL } from "@/data/consts";
import { deleteFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function DeleteTestService(productId: number) {
  try {
    const result = await deleteFetch(`${APIURL}wishlists/${productId}`);

    const jsonResult = await result.json();
    if (result.ok) {
      toast.success("محصول با موفقیت حذف شد", {
        description: "محصول مورد نظر از لیست علاقه‌مندی‌های شما حذف گردید",
      });
      return jsonResult;
    } else {
      // مدیریت خطاهای مختلف
      switch (result.status) {
        case 400:
          toast.error("خطای درخواست", {
            description: jsonResult.message || "درخواست نامعتبر است",
          });
          break;
        case 401:
          toast.error("عدم دسترسی", {
            description: "شما مجوز انجام این عمل را ندارید",
          });
          break;
        case 403:
          toast.error("ممنوع", {
            description: "دسترسی به این عملیات ممنوع است",
          });
          break;
        case 404:
          toast.error("یافت نشد", {
            description: "محصول مورد نظر در لیست علاقه‌مندی‌ها یافت نشد",
          });
          break;
        case 500:
          toast.error("خطای سرور", {
            description: "خطایی در سرور رخ داده است",
          });
          break;
        default:
          toast.error("خطای ناشناخته", {
            description: jsonResult.error || "خطای نامشخصی رخ داده است",
          });
      }
      throw new Error(jsonResult.error);
    }
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    toast.error("خطا در حذف محصول", {
      description: "خطایی در حذف محصول از لیست علاقه‌مندی‌ها رخ داده است",
    });
    throw error;
  }
}

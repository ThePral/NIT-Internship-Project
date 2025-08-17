import { APIURL } from "@/data/consts";
import { updateFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function ChangeTestService(nationalcode: string) {
  try {
    const result = await updateFetch(
      APIURL + `users/changeInfo`,
      JSON.stringify({ national_id: nationalcode }),
      "PATCH"
    );
    const jsonResult = await result.json();
    if (result.ok) {
      toast.success("کد ملی با موفقیت تغییر کرد", {
        description: "تغییر کد ملی شما با موفقیت ثبت شد",
      });
      return jsonResult;
    } else {
      console.log("error change national");
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
            description: "منبع درخواستی یافت نشد",
          });
          break;
        case 409:
          toast.error("تضاد", {
            description: "این کد ملی قابل قبول نیست",
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
    // Add catch block
    console.error("Error changing national code:", error);
    toast.error("خطا در تغییر کد ملی", {
      description: "خطایی در تغییر کد ملی رخ داده است",
    });
    throw error;
  }
}

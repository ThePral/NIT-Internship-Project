import { APIURL } from "@/data/consts";
import { postFetch, updateFetch } from "@/lib/fetch";
import { toast } from "sonner";

export async function UserLoginService(username: string, password: string) {
  const result = await postFetch(
    APIURL + "auth/user",
    JSON.stringify({
      username,
      password,
    })
  );

  const jsonResult = await result.json();

  if (result.ok) {
    toast.success("ورود با موفقیت انجام شد", {
      description: "شما با موفقیت به سیستم وارد شدید",
    });
    return jsonResult;
  } else {
    // Handle different error status codes
    switch (result.status) {
      case 400:
        toast.error("خطای درخواست", {
          description:
            jsonResult.message || "نام کاربری یا رمز عبور نامعتبر است.",
        });
        break;
      case 401:
        toast.error("عدم احراز هویت", {
          description: "نام کاربری یا رمز عبور اشتباه است.",
        });
        break;
      case 403:
        toast.error("کاربر یافت نشد", {
          description: "کاربری با اطلاعات وارد شده یافت نشد",
        });
        break;
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

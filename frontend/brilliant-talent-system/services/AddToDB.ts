import { APIURL } from "@/data/consts";
import { mapBackendError } from "@/lib/errorHandler";
import { postFetch } from "@/lib/fetch";
import { mapBackendErrorToPersian } from "@/lib/mapBackendErrorToPersian";
import { toast } from "sonner";

export async function AddToDB() {
  const result = await postFetch(APIURL + "admins/excels/", {});
  let jsonResult: any = {};
  try {
    jsonResult = await result.json();
  } catch { }

  if (!result.ok) {
    const error = mapBackendError(result.status, jsonResult);
    const msg = mapBackendErrorToPersian(error.message);
    toast.error(msg, { description: "افزودن به دیتابیس موفقیت‌آمیز نبود" });
    throw error;
  }

  // toast.success("افزودن با موفقیت انجام شد");
  return jsonResult;
}

import { APIURL } from "@/data/consts";
import { mapBackendError } from "@/lib/errorHandler";
import { getFetch } from "@/lib/fetch";
import { mapBackendErrorToPersian } from "@/lib/mapBackendErrorToPersian";
import { toast } from "sonner";

export async function CheckAddToDB(JobID: string) {
  const url = APIURL + `queue/imports/` + JobID;

  let result: Response;
  let jsonResult: any = {};

  try {
    result = await getFetch(url);
    try {
      jsonResult = await result.json();
    } catch {}

    if (!result.ok) {
      const error = mapBackendError(result.status, jsonResult);
      const msg = mapBackendErrorToPersian(error.message);
      toast.error(msg, { description: "دریافت چک موفقیت‌آمیز نبود" });
      throw error;
    }

    console.log(jsonResult, "چک با موفقیت دریافت شد");
    return jsonResult;
  } catch (error) {
    console.error("خطا در دریافت چک:", error);
    toast.error("خطا", { description: "خطایی در دریافت چک رخ داده است" });
    throw error;
  }
}

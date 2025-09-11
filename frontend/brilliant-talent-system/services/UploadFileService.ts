import { APIURL } from "@/data/consts";
import { mapBackendError } from "@/lib/errorHandler";
import { postFetch } from "@/lib/fetch";
import { mapBackendErrorToPersian } from "@/lib/mapBackendErrorToPersian";
import { toast } from "sonner";

export async function UploadFileService(type: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await postFetch(APIURL + "admins/upload/" + type, formData);
  let jsonResult: any = {};
  try {
    jsonResult = await result.json();
  } catch {}

  if (!result.ok) {
    const error = mapBackendError(result.status, jsonResult);
    const msg = mapBackendErrorToPersian(error.message);
    toast.error(msg, { description: `آپلود ${type} موفقیت‌آمیز نبود` });
    throw error;
  }
  toast.success("آپلود با موفقیت انجام شد", {
    description: `آپلود ${type} با موفقیت انجام شد`,
  });

  return jsonResult;
}

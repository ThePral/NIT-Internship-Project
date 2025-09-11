export function mapBackendError(status: number, jsonResult: any): Error {
  const backendMsg =
    jsonResult?.message || jsonResult?.error || "خطای ناشناخته";

  switch (status) {
    case 400:
      return new Error(backendMsg || "درخواست نامعتبر بود");
    case 401:
      return new Error("401");
    case 403:
      return new Error(backendMsg || "شما مجوز دسترسی ندارید");
    case 404:
      return new Error(backendMsg || "موردی یافت نشد");
    case 409:
      return new Error(backendMsg || "تضاد در داده‌ها");
    case 422:
      return new Error(backendMsg || "داده‌های ارسالی معتبر نیستند");
    case 429:
      return new Error(
        "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
      );
    case 500:
      return new Error(backendMsg || "خطای داخلی سرور");
    case 503:
      return new Error("سرویس در دسترس نیست. لطفاً بعداً امتحان کنید.");
    default:
      return new Error(backendMsg || "خطای ناشناخته");
  }
}

export function mapBackendErrorToPersian(error: string | null): string {
  if (!error) return "خطای ناشناخته رخ داد";

  // وضعیت 401
  if (error === "401") {
    return "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.";
  }

  const err = error.toLowerCase();

  // خطاهای مربوط به ImportService
  if (err.includes("could not detect") && err.includes("name")) {
    return "ستون نام در فایل پیدا نشد. لطفاً مطمئن شوید ستون 'نام' وجود دارد.";
  }
  if (err.includes("failed to detect required columns")) {
    return "ستون‌های ضروری (مثل شماره پرونده یا رشته) در فایل شناسایی نشدند.";
  }
  if (err.includes("failed to detect required column (grade)")) {
    return "ستون معدل در فایل پیدا نشد.";
  }

  // خطاهای تخصیص
  if (err.includes("allocationrun") && err.includes("not found")) {
    return "اجرای تخصیص مربوطه یافت نشد.";
  }
  if (err.includes("no allocationrun")) {
    return "هیچ اجرای تخصیص در پایگاه داده وجود ندارد.";
  }

  // خطاهای PDF
  if (err.includes("font file not found")) {
    return "فونت مورد نیاز برای ساخت PDF پیدا نشد.";
  }

  // خطاهای احراز هویت
  if (err.includes("دسترسی غیر مجاز") || err.includes("unauthorized")) {
    return "دسترسی شما مجاز نیست.";
  }
  if (err.includes("forbidden")) {
    return "شما مجاز به انجام این عملیات نیستید.";
  }

  // خطاهای دیتابیس
  if (err.includes("unique constraint failed") || err.includes("p2002")) {
    return "این اطلاعات قبلاً استفاده شده است.";
  }

  return "خطا: " + error; // fallback
}

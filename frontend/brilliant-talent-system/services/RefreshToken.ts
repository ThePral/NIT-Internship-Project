import { APIURL } from "@/data/consts";
import { getFetch, postFetch } from "@/lib/fetch";

export async function RefreshToken(type: "users" | "admins" | "superAdmins") {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("برای ادامه باید دوباره وارد شوید.");
  }

  const refreshResult = await postFetch(
    APIURL + "auth/refreshTokens",
    JSON.stringify({ refresh_token: refreshToken })
  );
  const refreshJsonResult = await refreshResult.json();

  if (!refreshResult.ok) {
    throw new Error("ورود شما منقضی شده است. لطفاً دوباره وارد شوید.");
  }

  localStorage.setItem("authToken", refreshJsonResult.access_token);
  localStorage.setItem("refreshToken", refreshJsonResult.refresh_token);

  const retryResult = await getFetch(APIURL + `${type}/me`);
  const retryJsonResult = await retryResult.json();

  if (!retryResult.ok) {
    throw new Error("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
  }

  return retryJsonResult;
}

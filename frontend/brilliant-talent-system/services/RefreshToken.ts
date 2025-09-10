import { APIURL } from "@/data/consts";
import { getFetch, postFetch } from "@/lib/fetch";

export async function RefreshToken(type: "users" | "admins" | "superAdmins") {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const refreshResult = await postFetch(
      APIURL + "auth/refreshTokens",
      JSON.stringify({
        refresh_token: refreshToken,
      })
    );
    const refreshJsonResult = await refreshResult.json();
    if (refreshResult.ok) {
      localStorage.setItem("authToken", refreshJsonResult.access_token);
      localStorage.setItem(
        "refreshToken",
        refreshJsonResult.refresh_token
      );
      const retryResult = await getFetch(APIURL + `${type}/me`);
      const retryJsonResult = await retryResult.json();

      if (retryResult.ok) {
        return retryJsonResult;
      }
    }
  }
}
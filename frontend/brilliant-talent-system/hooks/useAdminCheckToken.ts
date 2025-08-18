import { Admin, User } from "@/interfaces/user";
import { getFetch, postFetch } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

export function useAdminCheckToken() {
  return useQuery<Admin, Error>({
    queryKey: ["myaccount"],
    queryFn: async () => {
      const result = await getFetch(`admins/me`);
      const jsonResult = await result.json();
      if (result.ok) {
        console.log(jsonResult, "success");

        return jsonResult;
      } else {
        if (result.status == 401) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const refreshResult = await postFetch(
              "auth/refreshTokens",
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
              const retryResult = await getFetch(`admins/me`);
              const retryJsonResult = await result.json();
              if (retryResult.ok) {
                return retryJsonResult;
              }
            }
          }
        }
        throw new Error(jsonResult.error);
      }
    },
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

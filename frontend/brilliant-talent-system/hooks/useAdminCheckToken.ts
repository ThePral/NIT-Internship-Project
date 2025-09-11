import { APIURL } from "@/data/consts";
import { Admin, User } from "@/interfaces/user";
import { getFetch, postFetch } from "@/lib/fetch";
import { RefreshToken } from "@/services/RefreshToken";
import { useQuery } from "@tanstack/react-query";

export function useAdminCheckToken() {
  return useQuery<Admin, Error>({
    queryKey: ["myaccount"],
    queryFn: async () => {
      const result = await getFetch(APIURL + `admins/me`);
      const jsonResult = await result.json();
      if (result.ok) {
        console.log(jsonResult, "success");

        return jsonResult;
      } else {
        if (result.status == 401) {
          return RefreshToken("admins")
        }
        throw new Error(jsonResult.error);
      }
    },
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

import { APIURL } from "@/data/consts";
import { Admin, SuperAdmin } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { RefreshToken } from "@/services/RefreshToken";
import { useQuery } from "@tanstack/react-query";

// برای Admin
export function useAdminCheckToken() {
  return useQuery<Admin, Error>({
    queryKey: ["myaccount"],
    queryFn: async () => {
      const result = await getFetch(APIURL + `admins/me`);
      const jsonResult = await result.json();

      if (result.ok) {
        return jsonResult;
      } else {
        if (result.status === 401) {
          return RefreshToken("admins");
        }
        throw new Error("خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    },
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

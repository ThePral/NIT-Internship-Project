import { APIURL } from "@/data/consts";
import { Admin, SuperAdmin, User } from "@/interfaces/user";
import { getFetch, postFetch } from "@/lib/fetch";
import { RefreshToken } from "@/services/RefreshToken";
import { useQuery } from "@tanstack/react-query";

export function useSuperAdminCheckToken() {
  return useQuery<SuperAdmin, Error>({
    queryKey: ["myaccount"],
    queryFn: async () => {
      const result = await getFetch(APIURL + `superAdmins/me`);
      const jsonResult = await result.json();

      if (result.ok) {
        return jsonResult;
      } else {
        if (result.status === 401) {
          return RefreshToken("superAdmins"); // تلاش برای تازه‌سازی توکن
        }
        throw new Error("خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    },
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

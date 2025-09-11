import { APIURL } from "@/data/consts";
import { User } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { RefreshToken } from "@/services/RefreshToken";
import { useQuery } from "@tanstack/react-query";

export function useUserCheckToken() {
  return useQuery<User, Error>({
    queryKey: ["myaccount"],
    queryFn: async () => {
      const result = await getFetch(APIURL + `users/me`);
      const jsonResult = await result.json();

      if (result.ok) {
        return jsonResult;
      } else {
        if (result.status === 401) {
          return RefreshToken("users");
        }
        throw new Error("خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    },
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

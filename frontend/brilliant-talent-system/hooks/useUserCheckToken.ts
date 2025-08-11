import { User } from "@/interfaces/user";
import { getFetch } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

export function useUserCheckToken() {
  return useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await getFetch(`users/checkToken`);
      const jsonResult = await result.json();
      if (result.ok) {
        console.log(jsonResult, "success");
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

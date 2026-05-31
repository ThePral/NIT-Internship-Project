import { GetUsersService } from "@/services/GetUsers";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetUsers(cycleID?: number) {
  return useQuery<any, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!cycleID) return null;
      const result = await GetUsersService(cycleID);
      return result ?? null;
    },

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetUsers;

import { GetUsersService } from "@/services/GetUsers";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetUsers() {
  return useQuery<any, Error>({
    queryKey: ["users"],
    queryFn: async () => await GetUsersService(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetUsers;

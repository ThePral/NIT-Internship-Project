import { GetAdmins } from "@/services/GetAdmins";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetAdmins() {
  return useQuery<any, Error>({
    queryKey: ["admins"],
    queryFn: async () => await GetAdmins(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetAdmins;

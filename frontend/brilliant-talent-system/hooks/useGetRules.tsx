import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetRules() {
  return useQuery<any, Error>({
    queryKey: ["rules"],
    queryFn: async () => await GetRules(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetRules;

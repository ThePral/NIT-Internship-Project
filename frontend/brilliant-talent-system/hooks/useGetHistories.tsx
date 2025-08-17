import { GetHistories } from "@/services/GetHistories";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetHistories() {
  return useQuery<any, Error>({
    queryKey: ["histories"],
    queryFn: async () => await GetHistories(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetHistories;

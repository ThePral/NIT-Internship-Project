import { GetFields } from "@/services/GetFields";
import { GetHistories } from "@/services/GetHistories";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetFields() {
  return useQuery<any, Error>({
    queryKey: ["fields"],
    queryFn: async () => await GetFields(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetFields;

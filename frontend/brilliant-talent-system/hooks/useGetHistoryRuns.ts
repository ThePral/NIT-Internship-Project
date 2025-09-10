import { HistoryRow } from "@/interfaces/operation";
import { GetHistories } from "@/services/GetHistories";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetHistoryRuns() {
    return useQuery<HistoryRow[], Error>({
        queryKey: ["historyRun"],
        queryFn: async () => await GetHistories(),

        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
export default useGetHistoryRuns;

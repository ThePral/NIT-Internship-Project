import { HistoryResult } from "@/interfaces/operation";
import { GetAcceptedStudentsHistory } from "@/services/GetAcceptedStudentsHistory";
import { useQuery } from "@tanstack/react-query";

function useGetAcceptedStudentsHistory(id: number) {
    return useQuery<HistoryResult[], Error>({
        queryKey: ["history"],
        queryFn: async () => await GetAcceptedStudentsHistory(id),

        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
export default useGetAcceptedStudentsHistory;

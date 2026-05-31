
import { StudentResult } from "@/interfaces/operation";
import { GetAcceptedStudentsHistory } from "@/services/GetAcceptedStudentsHistory";
import { useQuery } from "@tanstack/react-query";

function useGetAcceptedStudentsHistory(cycleID?: number) {
    return useQuery<StudentResult[], Error>({
        queryKey: ["history"],
        queryFn: async () => {
            let result
            cycleID && (
                result = await GetAcceptedStudentsHistory(cycleID)
            )
            return result ? result : []
        },

        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
export default useGetAcceptedStudentsHistory;

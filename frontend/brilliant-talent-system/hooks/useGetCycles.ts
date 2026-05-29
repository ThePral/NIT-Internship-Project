import { Cycle } from "@/interfaces/operation";
import { GetCycles } from "@/services/GetCycles";
import { useQuery } from "@tanstack/react-query";

function useGetCycles() {
    return useQuery<Cycle[], Error>({
        queryKey: ["cycles"],
        queryFn: async () => await GetCycles(),

        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
export default useGetCycles;

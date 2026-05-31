import { UploadState } from "@/interfaces/operation";
import { GetHistories } from "@/services/GetHistories";
import { GetIsUploadeds } from "@/services/GetIsUploadeds";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetIsUploadeds(cycle?: number) {
  return useQuery<UploadState | null, Error>({
    queryKey: ["uploadeds", cycle],
    queryFn: async () => {
      if (!cycle) return null;
      const result = await GetIsUploadeds(cycle);
      return result ?? null;
    },
    enabled: !!cycle, // ✅ don't even run the query if cycle is missing
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetIsUploadeds;

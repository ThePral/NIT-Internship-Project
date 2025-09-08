import { UploadState } from "@/interfaces/operation";
import { GetHistories } from "@/services/GetHistories";
import { GetIsUploadeds } from "@/services/GetIsUploadeds";
import { GetRules } from "@/services/GetRules";
import { useQuery } from "@tanstack/react-query";

function useGetIsUploadeds() {
  return useQuery<UploadState, Error>({
    queryKey: ["uploadeds"],
    queryFn: async () => await GetIsUploadeds(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetIsUploadeds;

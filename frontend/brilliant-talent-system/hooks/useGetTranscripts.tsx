import { GetTranscripts } from "@/services/GetTranscripts";
import { useQuery } from "@tanstack/react-query";

function useGetTranscripts() {
  return useQuery<any, Error>({
    queryKey: ["transcripts"],
    queryFn: async () => await GetTranscripts(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetTranscripts;

import { GetAcceptedStudents } from "@/services/GetAcceptedStudents ";
import { useQuery } from "@tanstack/react-query";

function useGetAcceptedStudents() {
  return useQuery<any, Error>({
    queryKey: ["acceptedStudents"],
    queryFn: async () => await GetAcceptedStudents(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetAcceptedStudents;

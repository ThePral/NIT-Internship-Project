import { StudentReport } from "@/interfaces/operation";
import { GetStudentReport } from "@/services/GetMyReport";
import { useQuery } from "@tanstack/react-query";

function useGetStudentReport() {
    return useQuery<StudentReport, Error>({
        queryKey: ["report"],
        queryFn: async () => await GetStudentReport(),

        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
export default useGetStudentReport;

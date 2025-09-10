"use client";
import { StudentResult } from "@/interfaces/operation";
import { GetStudentResult } from "@/services/GetMyResult";
import { useQuery } from "@tanstack/react-query";

function useGetStudentResult() {
  return useQuery<StudentResult, Error>({
    queryKey: ["report"],
    queryFn: async () => await GetStudentResult(),

    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export default useGetStudentResult;

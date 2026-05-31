'use client'
import { Trash2, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Cycle } from "@/interfaces/operation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCycle } from "@/services/DeleteCycle";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteResultsAndExcels } from "@/services/DeleteResultsAndExcels";

interface Props{
  cycle?:Cycle

}

export function DeleteCycleOrResult({cycle}:Props) {
  const queryClient = useQueryClient();
  const [open , setOpen] = useState(false)
  const deleteResults= useMutation({
    mutationFn: async () => {cycle!==undefined && DeleteResultsAndExcels(cycle?.id)},
    onSuccess: (res) => {
      console.log("res", res);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["history"] });
        
      }, 1000);
      toast.success(`نتایج و اکسل های دوره ${cycle?.name} با موفقیت حذف شدند`)
      setOpen(false)
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const deleteCycle= useMutation({
    
    mutationFn: async () =>{cycle!==undefined && DeleteCycle(cycle?.id) },
    onSuccess: (res) => {
      console.log("res", res);
      setOpen(false)
      toast.success(`دوره ${cycle?.name} با موفقیت حذف شد`)
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["cycles"] });
        
      }, 1000);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <button onClick={()=>setOpen(true)} disabled={cycle==undefined} className="cursor-pointer p-1 rounded-lg transition-all hover:bg-gray-100 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className='text-danger hover:bg-accent transition-colors size-8 '/></button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>حذف نتایج دوره {cycle?.name}؟</AlertDialogTitle>
          <AlertDialogDescription>
            آیا از حذف نتایج دوره ی {cycle?.name} مطمئنید؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={()=> deleteResults.mutate()} disabled={cycle == undefined} variant="outline" className="border-danger border-2 hover:text-danger text-danger font-semibold">حذف نتایج</AlertDialogAction>
          <AlertDialogAction onClick={()=> deleteCycle.mutate()}  disabled={cycle == undefined} variant="destructive" className="text-white hover:bg-red-400">حذف کل دوره</AlertDialogAction>
          <AlertDialogCancel onClick={()=>setOpen(false)} className="col-span-2" variant="outline">لغو</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCycleOrResult;

import { GenericDataTable } from '@/features/adminMenu/newOperation/dataTable/GenericDataTable'
import React, { useEffect, useState } from 'react'

import useGetAcceptedStudents from '@/hooks/useGetAcceptedStudents'
import { acceptedHistoryColumns } from './accceptedHistoryColumns'
import useGetAcceptedStudentsHistory from '@/hooks/useGetAcceptedStudentsHistory'
import { Download, Loader, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import SelectCycle from '@/features/adminMenu/newOperation/SelectCycle'
import ExportDropDown from '../ExportResults/ExportDropDown'
import DeleteCycleOrResult from '@/features/adminMenu/history/DeleteCycleOrResult'
import { Cycle } from '@/interfaces/operation'

interface Props{
  cycleID:number
}
const AcceptedHistoryTable = () => {
  const [cycle , setCycle] = useState<Cycle>()
  const queryClient = useQueryClient()
  const {data , isLoading , error } = useGetAcceptedStudentsHistory(cycle?.id)
  useEffect(()=>{
      queryClient.invalidateQueries({ queryKey: ["history"]})
  },[cycle])
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">تاریخچه</h1>
      {!isLoading ?  
          <GenericDataTable
              data={data}
              columns={acceptedHistoryColumns}
              title=""
              isLoading={isLoading}
              isError={error ? true : false}
              searchPlaceholder="جستجوی دانشجو..."
          >
            <div className='flex gap-1 w-full items-center'>
              <SelectCycle setCycle={setCycle} />
              <ExportDropDown  cycleID={cycle?.id} />   
              <DeleteCycleOrResult cycle={cycle}/>
            </div>
          </GenericDataTable>
      : <Loader className='animate-spin'/>}
    </div>
  )
}

export default AcceptedHistoryTable
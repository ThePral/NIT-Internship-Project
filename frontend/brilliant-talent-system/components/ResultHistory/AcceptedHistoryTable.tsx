import { GenericDataTable } from '@/features/adminMenu/newOperation/dataTable/GenericDataTable'
import React, { useEffect, useState } from 'react'

import useGetAcceptedStudents from '@/hooks/useGetAcceptedStudents'
import { acceptedHistoryColumns } from './accceptedHistoryColumns'
import useGetAcceptedStudentsHistory from '@/hooks/useGetAcceptedStudentsHistory'
import { Loader } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import SelectCycle from '@/features/adminMenu/newOperation/SelectCycle'

interface Props{
  cycleID:number
}
const AcceptedHistoryTable = () => {
  const [cycleID , setCycleID] = useState<number>(2)
  const queryClient = useQueryClient()
  const {data , isLoading , error } = useGetAcceptedStudentsHistory(cycleID)
  useEffect(()=>{
      queryClient.invalidateQueries({ queryKey: ["history"]})
  },[cycleID])
  return (
    <div>
      {!isLoading ?  
          <GenericDataTable
              data={data}
              columns={acceptedHistoryColumns}
              title=""
              isLoading={isLoading}
              isError={error ? true : false}
              searchPlaceholder="جستجوی دانشجو..."
          >
            <SelectCycle setCycleID={setCycleID} />
          </GenericDataTable>
      : <Loader className='animate-spin'/>}
    </div>
  )
}

export default AcceptedHistoryTable
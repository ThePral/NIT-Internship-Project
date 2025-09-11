import { GenericDataTable } from '@/features/adminMenu/newOperation/dataTable/GenericDataTable'
import React from 'react'

import useGetAcceptedStudents from '@/hooks/useGetAcceptedStudents'
import { acceptedHistoryColumns } from './accceptedHistoryColumns'
import useGetAcceptedStudentsHistory from '@/hooks/useGetAcceptedStudentsHistory'
import { Loader } from 'lucide-react'

interface Props{
  id:number
}
const AcceptedHistoryTable = ({id}:Props) => {
  const {data , isLoading , error } = useGetAcceptedStudentsHistory(id)
  return (
    <div>
      {!isLoading ? 
        data ? 
          <GenericDataTable
              data={data}
              columns={acceptedHistoryColumns}
              title=""
              isLoading={isLoading}
              isError={error ? true : false}
              searchPlaceholder="جستجوی دانشجو..."
          />
          : <p>دیتایی وجود ندارد</p>
      : <Loader className='animate-spin'/>}
    </div>
  )
}

export default AcceptedHistoryTable
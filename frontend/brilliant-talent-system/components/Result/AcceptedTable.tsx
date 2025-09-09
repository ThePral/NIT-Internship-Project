import { GenericDataTable } from '@/features/adminMenu/newOperation/dataTable/GenericDataTable'
import React from 'react'
import { acceptedColumns } from './accceptedColumns'
import useGetAcceptedStudents from '@/hooks/useGetAcceptedStudents'

const AcceptedTable = () => {
  const {data , isLoading , error } = useGetAcceptedStudents()
  return (
    <div>
      <GenericDataTable
          data={data}
          columns={acceptedColumns}
          title=""
          isLoading={isLoading}
          isError={error ? true : false}
          searchPlaceholder="جستجوی دانشجو..."
      />
    </div>
  )
}

export default AcceptedTable
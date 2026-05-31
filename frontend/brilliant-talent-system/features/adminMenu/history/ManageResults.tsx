'use client'

import { useEffect, useState } from "react"
import SelectCycle from "../newOperation/SelectCycle"
import AcceptedHistoryTable from "@/components/ResultHistory/AcceptedHistoryTable"
import { useQueryClient } from "@tanstack/react-query"

const ManageResults = () => {
    return (
        <div className="w-full  rounded-xl md:mx-auto shadow-primary bg-card p-6 font-primary shadow-sm mt-4">
            <AcceptedHistoryTable/>
        </div>
    )
}

export default ManageResults
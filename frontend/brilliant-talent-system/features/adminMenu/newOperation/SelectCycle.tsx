"use client"
import { Button } from "@/components/"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import useGetCycles from "@/hooks/useGetCycles"
import { Cycle } from "@/interfaces/operation"
import {AddCycle} from './AddCycle'
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

interface Props {
  setCycleID: (id: number) => void
  allowAdd?:boolean
}

export function SelectCycle({ setCycleID , allowAdd=false }: Props) {
  const { data: cycles, isLoading } = useGetCycles()
  const [open , setOpen] = useState(false)

  const sortedCycles = useMemo(
    () => [...(cycles ?? [])].reverse(),
    [cycles]
  )

  return (
    <div className="flex gap-2 w-full">
        {allowAdd && <AddCycle isOpen={open} setIsOpen={setOpen}/>}
        <Combobox
        items={sortedCycles}
            onValueChange={(value) => {
                const selected = sortedCycles?.find((c: Cycle) => c.name === value)
                if (selected) setCycleID(selected.id)
            }}
        >
        <ComboboxInput className="w-full"  placeholder="انتخاب دوره" />
        <ComboboxContent>
            <ComboboxEmpty>هیچ دوره ای یافت نشد</ComboboxEmpty>
            <ComboboxList>
              {(item: Cycle) => (
                <ComboboxItem key={item.id} value={String(item.name)}>
                  {item.name}
                </ComboboxItem>
              )}      
            </ComboboxList>
        </ComboboxContent>
        </Combobox>
    </div>

  )
}

export default SelectCycle
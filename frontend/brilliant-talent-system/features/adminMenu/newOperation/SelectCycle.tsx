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
import { useState } from "react"

interface Props {
  setCycleID: (id: number) => void
}

export function SelectCycle({ setCycleID }: Props) {
  const { data: cycles, isLoading } = useGetCycles()
  const [open , setOpen] = useState(false)

  return (
    <div className="flex gap-2 flex-re">
        <AddCycle isOpen={open} setIsOpen={setOpen}/>
        <Combobox
        items={cycles}
            onValueChange={(value) => {
                const selected = cycles?.find((c: Cycle) => c.name === value)
                if (selected) setCycleID(selected.id)
            }}
        >
        <ComboboxInput placeholder="انتخاب دوره" />
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
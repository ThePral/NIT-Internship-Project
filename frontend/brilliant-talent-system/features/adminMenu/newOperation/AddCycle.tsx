import { Button } from '@/components/'
import { Input } from '@/components/ui/input'
import { ResponsiveModal, ResponsiveModalClose, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalFooter, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from '@/components/ui/responsiveModal'
import { AddCycleService } from '@/services/AddCycleService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Plus } from 'lucide-react'
import React, { useRef, useState } from 'react'


interface Props{
    isOpen:boolean
    setIsOpen:(sth:boolean)=>void
}

export const AddCycle = ({isOpen,setIsOpen}:Props) => {
    const nameRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const loginMutate = useMutation({
    mutationFn: async ({
      name,
    }: {
      name: string;
    }) => AddCycleService(name),
    onSuccess: (res) => {
      console.log("res", res);
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
    },
    onError: (error) => {
      console.log("error12");
    },
  });

    return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveModalTrigger asChild>
        <Button variant="outline" className=""><Plus/> اضافه کردن دوره</Button>
      </ResponsiveModalTrigger>

      <ResponsiveModalContent
        position="center"
        size="md"
        className="max-h-[85vh] overflow-y-auto bg-card border-border"
      >
        <ResponsiveModalHeader className="border-border">
          <ResponsiveModalTitle className="text-xl sm:text-2xl text-right text-foreground">
            افزودن دوره
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <Input ref={nameRef} className='mt-8' placeholder='نام دوره' />

        <ResponsiveModalFooter className="mt-6 gap-2 sm:gap-0 border-t border-border pt-4">
            <ResponsiveModalClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-initial border-border hover:bg-muted"
              >
                انصراف
              </Button>
            </ResponsiveModalClose>
            <Button
              onClick={()=>nameRef.current?.value && loginMutate.mutate({name:nameRef.current?.value})}
              disabled={loginMutate.isPending}
              className="flex-1 md:mr-2 sm:flex-initial bg-primary text-primary-foreground hover:bg-primary/90"
            >
                افزودن
            </Button>
          </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}

export default AddCycle
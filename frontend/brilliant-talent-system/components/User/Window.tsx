'use client'
import { Card } from '@/components/ui/card'
import React from 'react'

export const Window = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <Card className='shadow-none p-5 w-full'>
        {children}
    </Card>
  )
}


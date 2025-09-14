'use client'
import {Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const router = useRouter()
    useEffect(()=>{
        router.push("/superAdmin/home")
    },[])
    return (
        <div className='w-full h-screen flex items-center justify-center'><Loader2 className='animate-spin' /></div>
    )
}

export default page
"use client"
import { Logo } from '@/components/ui/logo';
import { Loader2 } from "lucide-react";
import { useTheme } from 'next-themes';
import { Pixelify_Sans } from 'next/font/google'
import { PulseLoader } from 'react-spinners';

export default function Loading({msg}:{msg: string}) {
    return (
        <div className={`flex gap-3  h-[100dvh] w-screen flex-col z-50`}>
            <div className="flex justify-center items-center h-full w-full animate-pulse transition-all drop-shadow-xl">
                <Logo className={"text-6xl"}/>
            </div> 
            <div className="flex justify-center flex-col items-center mb-10 gap-2 text-muted-foreground text-center">
            <PulseLoader color={"white"} size={10}/>
                <small>{msg}</small>
            </div>
        </div>
    )
  }

  
"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { useToast } from '@/components/ui/use-toast';
import { User, useAuthContext } from "@/components/context/auth";
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';


export default function Home({ params }: {params: {sid:string}}) {

  const { toast } = useToast()
  const router = useRouter()
  const  user: User | null  = useAuthContext()
  
  const [userClses, setUserClses] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[] | null>()
  const [loading, setLoading] = useState(true)
  const [isNewSheetDialogOpen, setNewSheetDialogOpen] = useState(false)
  const [isSigninDialogOpen, setSigninDialogOpen] = useState(false)

  useEffect(()=>{
    if(!user) {
      router.push('/')
    }
    setLoading(false)
   
  },[user,router])

  return (loading)? <Loading msg='Getting Sheet...'/>:
    <div className='h-screen flex flex-col'>
      <Navbar/>
      <main className="flex flex-col h-full w-full">
        <div className='flex h-[90%] md:h-[80%] w-full justify-center md:items-center'>
          <Card className='w-full m-5 md:w-[80%]'>
            <CardHeader>
              <CardTitle className='text-lg md:text-2xl flex flex-row justify-between'>
                <div>
                  {params.sid}
                  <CardDescription className='text-xs md:text ml-1 hidden md:block'>View / Create Attendance Sheets</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <Separator orientation='horizontal'/>
            <CardContent className='mt-5'>
              
            </CardContent>
            {/* <CardFooter>
            </CardFooter> */}
          </Card>
        </div>
      </main>
    </div>
    
}

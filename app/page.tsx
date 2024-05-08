"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { FcGoogle } from "react-icons/fc";
import { SiGooglesheets } from "react-icons/si";
import { useToast } from '@/components/ui/use-toast';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { useAuthContext } from "@/components/context/auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';
import { auth } from '@/components/fb/config';
import { ClsType, UserType, createUser, getUser, getUserClses } from '@/components/fb/db';
import { NewSheetDialog } from '@/components/dialog/create-sheet';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners'
import { redirect, useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useGoogleLogin } from '@react-oauth/google';
import Loading from './loading';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import timeAgo from '@/lib/showtimeago'
import { Separator } from '@/components/ui/separator';
import { SigninDialog } from '@/components/dialog/signin-dialog';


export default function Home() {

  const { toast } = useToast()
  const form = useForm()
  const  user: User | null  = useAuthContext()
  const [userClses, setUserClses] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[] | null>()
  const [loading, setLoading] = useState(true)
  const [isNewSheetDialogOpen, setNewSheetDialogOpen] = useState(false)
  const [isSigninDialogOpen, setSigninDialogOpen] = useState(false)

  const [flow, setFlow] = useState<"signing" | "noAuth" | "authComplete" | "loading">("noAuth")
  const s = useSearchParams()

  useEffect(()=>{
    if(!user) return
    
    getUserClses(user).then((data)=>{
      setUserClses(data)
      setLoading(false)
    })
   
  },[])

  if(!user) return <SigninDialog open={true} setOpen={setSigninDialogOpen}/>

  return (loading)? <Loading msg='Getting your Classes...'/>:
    <div className='h-screen flex flex-col'>
      <Navbar/>
      <main className="flex flex-col h-full w-full">
        <NewSheetDialog open={isNewSheetDialogOpen} setOpen={setNewSheetDialogOpen}/>
        <div className='flex h-[90%] md:h-[80%] w-full justify-center md:items-center'>
          <Card className='w-full m-5 md:w-[80%]'>
            <CardHeader>
              <CardTitle className='text-lg md:text-2xl flex flex-row justify-between'>
                <div>
                  Your Sheets 
                  <CardDescription className='text-xs md:text ml-1 hidden md:block'>View / Create Attendance Sheets</CardDescription>
                </div>
                <div className='flex justify-end mb-3'><Button variant={'default'} size={'sm'} onClick={()=>setNewSheetDialogOpen(true)}><SiGooglesheets size={20} className='mr-2'/> Create Sheet</Button></div></CardTitle>
            </CardHeader>
            <Separator orientation='horizontal'/>
            <CardContent className='mt-5'>
              {userClses?.length ==0? <div>No Sheets. Create one to continue.</div>:
              (userClses?.map((cls)=>{
                return <Card key={cls.id} className='cursor-pointer hover:bg-slate-900 transition-all flex justify-between md:items-center flex-col md:flex-row mb-2'>
                  <div className='text md:text-lg p-3 flex flex-row items-center'> <SiGooglesheets size={20} className='mr-2'/> {(cls.data() as ClsType).title}</div>
                  <div className='text-muted-foreground text-xs md:text-sm mb-2 -mt-2 md:mb-0 md:mt-0 mr-5 flex justify-end'>Last Updated: {timeAgo((cls.data().updatedAt as Timestamp).seconds *1000)}</div>
                </Card>
              }))}
              
            </CardContent>
            {/* <CardFooter>
            </CardFooter> */}
          </Card>
        </div>
      </main>
    </div>
    
}

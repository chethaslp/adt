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
import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';
import { auth } from '@/components/fb/config';
import { ClsType, UserType, createUser, getUser, getUserClses } from '@/components/fb/db';
import { NewSheetDialog } from '@/components/dialog/create-sheet';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners'
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useGoogleLogin } from '@react-oauth/google';
import Loading from '@/app/loading';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import timeAgo from '@/lib/showtimeago'
import { Separator } from '@/components/ui/separator';
import { SigninDialog } from '@/components/dialog/signin-dialog';


export default function Home({ params }: {params: {sid:string}}) {

  const { toast } = useToast()
  const router = useRouter()
  const  user: User | null  = useAuthContext()
  
  const [userClses, setUserClses] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[] | null>()
  const [loading, setLoading] = useState(true)
  const [isNewSheetDialogOpen, setNewSheetDialogOpen] = useState(false)
  const [isSigninDialogOpen, setSigninDialogOpen] = useState(false)

  const s = useSearchParams()

  useEffect(()=>{
    if(!user) {
      router.push('/')
      return
    }
    
    getUserClses(user).then((data)=>{
      setUserClses(data)
      setLoading(false)
    })
   
  },[])

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

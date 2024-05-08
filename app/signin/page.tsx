"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { SiGooglesheets } from  "react-icons/si";
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from "@/components/context/auth";
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { apiKey, auth, db } from '@/components/fb/config';
import keys from '@/keys.json'
import { UserType, createUser, getUser } from '@/components/fb/db';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners'
import { addAttentenceData, createSheetFromTemplate } from '@/lib/sheets';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc } from 'firebase/firestore';

export default function Home() {

  const { toast } = useToast()
  const  user: User | null  = useAuthContext()
  const [accessToken, setAccessToken] = useState<string>()
  const [currentSheet, setCurrentSheet] = useState<string>()

  const [flow, setFlow] = useState<"signing" | "noAuth" | "authComplete" | "loading">("noAuth")  

  // const login = useGoogleLogin({
  //   flow: 'auth-code',
  //   scope:"https://www.googleapis.com/auth/spreadsheets",
  //   onSuccess: async tokenResponse => {
  //     tokenResponse.code
  //     localStorage.setItem("access_token", gapi.auth.getToken().access_token)
  //   }
  // });
  
  async function handleAuth(token:GoogleApiOAuth2TokenObject) {
    if(token.access_token){
      localStorage.setItem("access_token", token.access_token)
      // Signing in Firebase with the AccessToken
      signInWithCredential(auth, GoogleAuthProvider.credential(null,token.access_token)).then((uc)=>{
        createUser(uc.user)
        setFlow("authComplete");
      })
    }else console.log(token.error)
  }

  async function validateUser(user: User){
    const userData:UserType  = await getUser(user)
      if(user){
        if(localStorage.getItem("access_token") && localStorage.getItem("access_token")?.length != 0){
          setFlow("authComplete")
          setAccessToken(localStorage.getItem("access_token") || "")
        } 
        else setFlow("signing")
      }else {
        // await createUser(user)
        setFlow("noAuth")
      }
      return userData
  }
  useEffect(()=>{
    if (user) validateUser(user)
    if (localStorage.getItem("saved") && localStorage.getItem("saved")?.length != 0) {
      setCurrentSheet(JSON.parse(localStorage.getItem("saved") || "")[0])
    }
    if(localStorage.getItem("access_token") && localStorage.getItem("access_token")?.length != 0){
      setFlow("authComplete")
      setAccessToken(localStorage.getItem("access_token") || "")
    } 
  },[])

  return (
    <div className='h-screen flex flex-col'>
      <Navbar/>
      <main className="flex flex-col h-full w-full">
        <div className='flex h-[80%] w-full justify-center items-center'>
          <Card className='w-full m-5 md:w-[80%]'>
            <CardHeader>
              <CardTitle>Welcome, {(user)? user.displayName: "User"}!</CardTitle>
              <CardDescription>Lets get started.</CardDescription>
            </CardHeader>
            <CardContent>
              {(()=>{
                if(flow =="signing"){
                 return <div className='flex items-center flex-col gap-2'>
                  <span>Now, connect your Google Sheets to ADT to continue.</span>
                <div className="flex w-fit p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-900 transition-all"
                        // onClick={() => gapi.auth.authorize({client_id: keys.web.client_id, scope:"profile https://www.googleapis.com/auth/spreadsheets"}, handleAuth)}
                        >
                        <SiGooglesheets size={20} className="mr-2 text-[#0F9F58]" />
                        Connect Google Sheets
                    </div>
                    
                  </div>
                }
                else if(flow == "loading"){
                  return <div className='flex items-center flex-col gap-2' ><HashLoader color='white' loading={true}/></div>
                }
                else if(flow == "authComplete"){
                  return <>
                    {/* <Button onClick={()=>addAttentenceData([],currentSheet || "")}>Add</Button> */}
                    <div className="flex w-fit p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-900 transition-all"
                              onClick={() => createSp()}>
                              <SiGooglesheets size={20} className="mr-2 text-[#0F9F58]" />
                              Create Sheet
                    </div>
                  </>
                }
                else{
                  return <div className='flex items-center flex-col gap-2' >
                <span>Signin with Google to continue.</span>
                <div className="flex w-fit p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-900 transition-all"
                    onClick={() => gapi.auth.authorize({client_id: keys.web.client_id, scope:"profile https://www.googleapis.com/auth/spreadsheets"}, handleAuth)}
                        // onClick={() => {
                        //         setFlow("loading")
                        //         const provider = new GoogleAuthProvider()
                        //         provider.addScope("https://www.googleapis.com/auth/spreadsheets")
                        //         signInWithPopup(auth, provider)
                        //         .then((rslt) => {
                        //           console.log(provider.getScopes())
                        //           validateUser(rslt.user)
                        //         })}}
                                // .catch((error) => {
                                //     setFlow("noAuth")
                                //   });
                                >
                        <FcGoogle size={20} className="mr-2" />
                        Signin with Google
                  </div>
              </div>

                }
              })()}
              
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
    
  )
}

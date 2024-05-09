import * as React from "react"

import { cn } from "@/lib/utils"
import useMediaQuery from "@/components/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { FaExclamation } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { and, collection, doc, getDocs, query, where } from "firebase/firestore"
import { auth, clientId, db } from "../fb/config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useTheme } from "next-themes";
import { createSheetFromTemplate } from "@/lib/sheets";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { createUser } from "../fb/db";
import { Logo } from "../ui/logo";
import SSImage from "@/public/img/ss-signin.png"
import Image from "next/image";
import { Separator } from "../ui/separator";

export function SigninDialog({open, setOpen}:{open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {

    return (<div className="h-[100dvh] w-full flex items-center justify-center flex-col">
      <Logo className="text-6xl mb-5"/>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Let&apos;s Get Started!</CardTitle>
          <CardDescription>
            Signin with Google to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <SigninForm/>
        <Separator className="mb-5 mt-5"/>
          <div className="text-base text-muted-foreground ">
            <span className="text-sm md:ml-3">Please ensure that you tick the following field while signing in :</span>
            <div className="flex gap-2 text-sm text-muted-foreground border p-2 m-3 rounded-lg justify-center flex-rol items-center">
              <b className="text-blue-600">●</b>See, edit, create and delete all your Google Sheets spreadsheets.
            </div> 
          </div>
        </CardContent>
        
      </Card>
    </div>)
}

function SigninForm({ className }: React.ComponentProps<"form">) {

  const user = useAuthContext()
  const { toast } = useToast()
  const { theme } = useTheme()

  const [admYear, setAdmYear] = React.useState<string>("####")
  const [batch, setBatch] = React.useState<string>("###")
  const [subject, setSubject] = React.useState<string>("######")
  const [title, setTitle] = React.useState<string>()
  const [loading, setLoading] = React.useState("")
  const [error, setError] = React.useState(false)

 
  function handleSignin() {
    setLoading("Authenticating...")
    window.gapi.auth.authorize({client_id: clientId, scope:"profile https://www.googleapis.com/auth/spreadsheets"}, (token:GoogleApiOAuth2TokenObject) =>{
      if(token.access_token){
        // Check if user has approved GSheet access.
        fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+token.access_token).then(async (resp)=>{
          const data = await resp.json()

          if(data.scope.includes("https://www.googleapis.com/auth/spreadsheets")) {
            localStorage.setItem("access_token", token.access_token)
          
          // Signing in Firebase with the Google oAuth AccessToken
          signInWithCredential(auth, GoogleAuthProvider.credential(null,token.access_token))
          .then((uc)=> createUser(uc.user))
          .then(()=> location.reload())
          }
          else{
            // If not approved, signout user and show error message.
            setError(true);
            gapi.auth.signOut()
            setLoading("")
          }
        })
      }else {
        setLoading("")
        console.log(token.error)
      }
    })}

  return ((loading != "")?<div className="p-4 gap-5 flex items-center justify-center flex-row">
  <HashLoader color={theme=="light"? undefined:"white"}/>{loading}
  </div>:
    <div className={cn("flex items-center justify-center flex-col gap-4", className)}>
      
      {(error)?<Card className="p-4 bg-red-500 gap-2 m-3 flex items-center flex-row text-sm">
        <FaExclamation size={30}/> Please Signin again and accept permissions for Google Sheets.
      </Card>:null}

      <div className="flex w-fit p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-900 transition-all" onClick={handleSignin}>
                        <FcGoogle size={20} className="mr-2" />
                        Signin with Google
      </div>

    </div>
  )
}

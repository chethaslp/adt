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
import { db } from "../fb/config"
import { Card } from "../ui/card"
import { useTheme } from "next-themes";
import { createSheetFromTemplate } from "@/lib/sheets";
import { useAuthContext } from "../context/auth";
import { useToast } from "../ui/use-toast";

export function NewSheetDialog({open, setOpen}:{open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Sheet</DialogTitle>
            <DialogDescription>
              Fill the following details and we will fetch the Student Records for you.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {

  const user = useAuthContext()
  const { toast } = useToast()
  const { theme } = useTheme()

  const [admYear, setAdmYear] = React.useState<string>("####")
  const [batch, setBatch] = React.useState<string>("###")
  const [subject, setSubject] = React.useState<string>("######")
  const [title, setTitle] = React.useState<string>()
  const [loading, setLoading] = React.useState("")
  const [error, setError] = React.useState(false)

  const handleSubmit = ()=>{
    if(!user) return
    setLoading("Getting Records...")
    const q = query(collection(db,"/templates"), where("adm","==",admYear), where("batch","==",batch))
    getDocs(q).then(async (qs)=>{
      if(qs.empty){
        setError(true)
        setLoading("")
      }else{
        setLoading("Creating Sheet...")
        const d = qs.docs[0].data() as {adm: string, batch: string, id:string}
        createSheetFromTemplate({template:d, title: title || "Untitled Attendence Sheet", user: user, sub_name: subject}).then((doc)=>{
          if(doc) toast({title:"Sheet Created.", description:title})
        })
      }

    })
    return false
  }



  return ((loading != "")?<div className="p-4 gap-5 flex items-center justify-center flex-row">
  <HashLoader color={theme=="dark"?"white":undefined}/>{loading}
  </div>:
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
      
      {(error)?<Card className="p-4 bg-red-500 gap-2 flex items-center flex-row text-sm">
        <FaExclamation size={30}/> Student Records of this batch has not been added yet.
      </Card>:null}
      <div className="grid gap-3">
        <Label htmlFor="username">Batch Info</Label>
        <div className="grid gap-2 grid-flow-col">
          <Select required onValueChange={(v)=>setAdmYear(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Admission Year" />
            </SelectTrigger>
            <SelectContent>
              {[...new Array(5)].map((x,i) => <SelectItem key={`Y${i+2019}`} value={(i+2019).toString()}>{i+2019}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select required onValueChange={(v)=>setBatch(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'CSE B1'}>CSE B1</SelectItem>
              <SelectItem value={'CSE B2'}>CSE B2</SelectItem>
              <SelectItem value={'IT'}>IT</SelectItem>
              <SelectItem value={'ECE'}>ECE</SelectItem>
            </SelectContent>
          </Select>
        </div>  
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" required onChange={(e)=>setSubject(e.currentTarget.value)}/>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Sheet Name</Label>
        <Input id="title" required onChange={(e)=>setTitle(e.currentTarget.value)} value={`${batch} (${admYear}) ${subject} - Attendance Sheet`}/>
      </div>
      <Button type="submit">Create Sheet</Button>
    </form>
  )
}

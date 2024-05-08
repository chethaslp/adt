import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { Separator } from "./separator";
import { Sun, Moon, User, UserCheck2 } from "lucide-react";
import { Button } from "./button";
import { Logo } from "./logo";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuthContext, User as UserType } from "../context/auth";
import { usePathname } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "../fb/config";
import { useToast } from "./use-toast";
import Image from "next/image";


export function Navbar({ qName }: {qName?:string}) {
    const { setTheme } = useTheme()
    const  user: UserType | null  = useAuthContext()
    const {toast} = useToast()

    // if(!user) redirect("/signin?c="+path)

    function handleUserLogin(){
        if(!user){
            try{
                const provider = new GoogleAuthProvider()
                provider.addScope("https://www.googleapis.com/auth/spreadsheets")
                signInWithPopup(auth, provider).then((v)=>(v.user)? toast({title:"Signed in Successfully!", icon:<UserCheck2/>}):null)
            }catch(err){
                toast({title:"Sign in Failed. Please Try Again.", icon:<UserCheck2/>})
            }
        }
        else signOut(auth);
    }
    
    return <div className='w-full backdrop-blur pr-5 pt-3 pl-5 pb-3'>
                <div className="flex items-center justify-between gap-2 flex-row">
                    <div className="flex items-center flex-row gap-2">
                        <Link href={"/"}><Logo size={"3xl"}/></Link>
                        {qName && <span className="text-lg ml-2">/&nbsp;{qName}</span>}
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild> 
                                {(user)? <Avatar><Image height={30} crossOrigin="anonymous" referrerPolicy="no-referrer" className="aspect-square h-full w-full" width={100} src={user.photoURL || ""} alt={user.displayName || ""}/></Avatar>:
                                <Button variant="outline" size="icon"> <User/> </Button>}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleUserLogin}>
                                    {(user)?"Signout":"Signin"}
                                    
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Separator className='mt-3 mb-4'/>
            </div>
    
}
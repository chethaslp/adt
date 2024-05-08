import { CollectionReference, doc, getDoc, setDoc, collection, getDocs, FieldValue, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";

export type UserType = {
    uid: string
    displayName: string,
    email: string,
    role: 'Faculty' | 'CR' | 'Admin',
    refreshToken: string,
    clses?: CollectionReference,
}

export type ClsType = {
    sid : string,
    title: string,
    templt_id : string,
    sub_name? : string,
    batch? : string,
    adm?: string,
    updatedAt?: any
}

export async function getUser(user:User){
    const rslt = await getDoc(doc(db, "/users/" + user.uid));
    return rslt.data() as UserType
}

export async function createUser(user:User){
        return setDoc(doc(db, "/users/" + user.uid),{
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: "Faculty",
            refreshToken: ""
         } as UserType).then(()=> true)
         .catch(()=> false)
}

export async function addCls(user:User, sheet:ClsType){
    sheet.updatedAt = serverTimestamp()
    return setDoc(doc(db, "users", user.uid,'clses', sheet.sid), sheet)
    .then(()=> true)
    .catch((err)=> {
        console.error(err)
        return false
    })
}

export async function getUserClses(user:User) {
    return getDocs(collection(doc(db, "users", user.uid),'clses'))
    .then((data)=> data.docs)
    .catch((err)=> {
        console.error(err)
        return null
    })
}
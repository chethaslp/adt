"use client";
import React from 'react';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { apiKey, app } from '@/components/fb/config';
import Loading from '@/app/loading';
import keys from '@/keys.json'
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { GenericConverter, User as UserDt } from '@/lib/models';

export const AuthContext = React.createContext<User | null>(null);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode} ) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    async function loadGAPI(){
        const gapi = (await import('gapi-script')).gapi
        
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async ()=>{
                gapi.client.init({
                apiKey: apiKey,
                clientId: keys.web.client_id,
                scope: "https://www.googleapis.com/auth/spreadsheets"
                }).then(()=> gapi.auth.init(()=> resolve(gapi)))
                .catch((err)=> reject(err))
            })
          }).then((en)=> gapi)
        }

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const gapi = await loadGAPI()
            window.gapi = gapi
            if (user) {
                // const userData:UserDt = {
                //     name:user.displayName || "",
                //     email:user.email || "",
                //     uid: user.uid,
                //     dp: user.photoURL || "",
                // }
                // setDoc(doc(db,"users",user.uid), userData)
                setUser(user);
                localStorage.setItem("access_token",gapi.auth.getToken().access_token)
                    
            } else {
                setUser(null);
                localStorage.removeItem("access_token")
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={ user }>
                {loading ? <Loading msg="Authenticating..."/> : children}
        </AuthContext.Provider>
    );
};

export type {User}
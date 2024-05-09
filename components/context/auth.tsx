"use client";
import React from 'react';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { apiKey, app, clientId } from '@/components/fb/config';
import Loading from '@/app/loading';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { GenericConverter, User as UserDt } from '@/lib/models';
import { loadAuth2, loadAuth2WithProps, loadGapiInsideDOM, } from 'gapi-script'

export const AuthContext = React.createContext<User | null>(null);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode} ) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const gapi = await loadGapiInsideDOM();
            await loadAuth2(gapi, clientId, '"https://www.googleapis.com/auth/spreadsheets"')
            window.gapi = gapi
            if (user) {
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
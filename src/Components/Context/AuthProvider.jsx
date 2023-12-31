import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth"
import app from '../firebase/firebase.config';
import { JobContext } from './JobProvider';

const auth = getAuth(app)


const authForGoogle = new GoogleAuthProvider(auth)

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { handleAdminSearch } = useContext(JobContext)

    useEffect(() => {
    }, [])


    // singup
    const signUp = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const continueWithgoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, authForGoogle)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                handleAdminSearch(user.email)
            }
            setLoading(false)
        });
        return () => {
            return unsubscribe();
        }
    }, []);


    const logOut = () => signOut(auth)

    const authInfo = {
        user,
        loading,
        signUp,
        signIn,
        continueWithgoogle,
        logOut
    }
    return (
        <AuthContext.Provider value={authInfo} >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
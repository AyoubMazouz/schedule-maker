import React, { createContext, useContext, useState, useEffect } from "react";
// Firebase Imports.
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [currUser, setCurrUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isRoot, setIsRoot] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const logout = () => {
        signOut(auth);
        navigate("/");
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const snapshot = await getDoc(doc(db, "users", user.uid));

                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setUserInfo(data);
                    if (data?.isAdmin) setIsAdmin(true);
                    else if (data?.isRoot) setIsRoot(true);
                }

                setCurrUser(user);
                setLoading(false);
            } else {
                setCurrUser(null);
                setIsRoot(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const value = {
        currUser,
        isRoot,
        isAdmin,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

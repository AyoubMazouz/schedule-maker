import React, { createContext, useContext, useState, useEffect } from "react";
// Firebase Imports.
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [currUser, setCurrUser] = useState(null);

    const navigate = useNavigate();

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const logout = () => {
        signOut(auth);
        navigate("/");
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        currUser,
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

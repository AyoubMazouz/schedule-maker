import React from "react";
// Firebase Imports.
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as _signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { DEFAULT_PROFILE_IMG } from "../helpers/constants";

export const useUser = () => {
  const navigate = useNavigate();

  const signUp = (
    username: string,
    email: string,
    password: string,
    type = ""
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        // Check if username taken.
        const snapshot = await getDoc(doc(db, "users", username));
        if (snapshot.exists()) throw new Error("name_taken");
        // Sign new user.
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(credentials.user, { displayName: username });
        // User doc.
        const document: any = {
          email,
          username,
          phone: "",
          org: "",
          img: DEFAULT_PROFILE_IMG,
          uid: credentials.user.uid,
          createdAt: Timestamp.now(),
        };
        if (type === "admin") document.isAdmin = true;
        else if (type === "root") document.isRoot = true;
        await setDoc(doc(db, "users", username), document);
        resolve(credentials.user);
      } catch (e: any) {
        if (e.code === "auth/invalid-email") reject("invalid_email");
        console.log(e.message);
        reject(e);
      }
    });

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signOut = () => {
    _signOut(auth);
    navigate("/");
  };
  return { signUp, signIn, signOut };
};

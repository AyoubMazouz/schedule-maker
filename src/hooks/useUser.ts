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
import { DEFAULT_BANNER, DEFAULT_PROFILE_IMG } from "../helpers/constants";
import { User } from "../helpers/types";

export const useUser = () => {
  const [loading, setLoading] = React.useState(true);
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
        const document: User = {
          email,
          username,
          phone: "",
          org: "",
          desc: "",
          address: "",
          img: DEFAULT_PROFILE_IMG,
          banner: DEFAULT_BANNER,
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

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const snapshot = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return snapshot.user.displayName;
    } catch (e) {
      setLoading(false);
      return "failed";
    }
  };

  const signOut = () => {
    _signOut(auth);
    navigate("/");
  };

  const updateUserDoc = async (document: User) => {
    setLoading(true);
    try {
      await setDoc(doc(db, "users", document.username), document);
      setLoading(false);
      return "success";
    } catch (e) {
      console.log(e);
      setLoading(false);
      return "failed";
    }
  };

  const getUserInfo = async (username: string) => {
    try {
      const snapshot = await getDoc(doc(db, "users", username));
      if (snapshot.exists()) {
        return snapshot.data() as User;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { loading, signUp, signIn, signOut, updateUserDoc, getUserInfo };
};

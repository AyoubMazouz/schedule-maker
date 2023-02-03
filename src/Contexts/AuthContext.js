import React from "react";
// Firebase Imports.
import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [currUser, setCurrUser] = React.useState(null);
  const [isRoot, setIsRoot] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snapshot = await getDoc(doc(db, "users", user.displayName));

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data?.isAdmin) setIsAdmin(true);
          else if (data?.isRoot) setIsRoot(true);
          setCurrUser(data);
        }
      } else {
        setCurrUser(null);
        setIsRoot(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currUser,
        isRoot,
        isAdmin,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);

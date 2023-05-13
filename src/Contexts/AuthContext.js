import React from "react";
// Firebase Imports.
import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = React.useState(true);
	const [currUser, setCurrUser] = React.useState(null);

	React.useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const snapshot = await getDoc(doc(db, "users", user.displayName));

				if (snapshot.exists()) {
					const data = snapshot.data();
					setCurrUser(data);
				}
			} else {
				setCurrUser(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currUser,
				loading,
			}}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => React.useContext(AuthContext);

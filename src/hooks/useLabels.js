import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const useLabels = () => {
    const deleteAllLabels = () => {
        return new Promise(async (resolve, reject) => {
            await deleteDoc(doc(db, "settings", "labels"));
            resolve(true);
        });
    };

    const setLabels = (data) => {
        return setDoc(doc(db, "settings", "labels"), data);
    };

    const getLabels = () => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "settings", "labels"));

            if (snapshot.exists()) {
                const data = snapshot.data();

                if (data.hasOwnProperty("levels")) {
                    resolve(data);
                } else {
                    resolve({
                        levels: [],
                        trainers: [],
                        rooms: [],
                        events: [],
                    });
                }
            }
            resolve({ levels: [], trainers: [], rooms: [], events: [] });
        });
    };
    return {
        getLabels,
        setLabels,
        deleteAllLabels,
    };
};

export default useLabels;

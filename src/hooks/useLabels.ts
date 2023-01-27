import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { LabelsType } from "../types";

const useLabels = () => {
    const deleteAllLabels = (userId: string) => {
        return new Promise(async (resolve, reject) => {
            await deleteDoc(doc(db, "labels", userId));
            resolve(true);
        });
    };

    const setLabels = (userId: string, data: LabelsType) => {
        return setDoc(doc(db, "labels", userId), data);
    };

    const getLabels = (userId: string) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "labels", userId));

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

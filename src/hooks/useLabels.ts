import {
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { LabelsType } from "../helpers/types";

interface DelAllLabels {
  (userId: string): Promise<boolean>;
}
interface SetLabels {
  (userId: string, data: LabelsType): Promise<any>;
}
interface GetLabels {
  (userId: string): Promise<LabelsType | DocumentData>;
}

const useLabels = () => {
  const deleteAllLabels: DelAllLabels = (userId: string) => {
    return new Promise(async (resolve, reject) => {
      await deleteDoc(doc(db, "labels", userId));
      resolve(true);
    });
  };

  const setLabels: SetLabels = (userId, data) => {
    return setDoc(doc(db, "labels", userId), data);
  };

  const getLabels: GetLabels = (userId: string) => {
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

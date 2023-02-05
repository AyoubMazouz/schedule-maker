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
  (username: string): Promise<boolean>;
}
interface SetLabels {
  (username: string, data: LabelsType): Promise<any>;
}
interface GetLabels {
  (username: string): Promise<LabelsType | DocumentData>;
}

const useLabels = () => {
  const deleteAllLabels: DelAllLabels = (username: string) => {
    return new Promise(async (resolve, reject) => {
      await deleteDoc(doc(db, "labels", username));
      resolve(true);
    });
  };

  const setLabels: SetLabels = (username, data) => {
    return setDoc(doc(db, "labels", username), data);
  };

  const getLabels: GetLabels = (username: string) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "labels", username));

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

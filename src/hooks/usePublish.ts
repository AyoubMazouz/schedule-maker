import React from "react";
import { setDoc, doc, Timestamp, onSnapshot, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";
import { PublishedDocument } from "../helpers/types";

interface PublishedDoc {
  (
    username: string,
    id: number,
    file: File,
    description: string
  ): Promise<string>;
}
interface GetPublishedDocs {
  (username: string, setData: (a: PublishedDocument[]) => void): void;
}
interface DelPublishedDoc {
  (
    username: string,
    id: number,
    documents: PublishedDocument[]
  ): Promise<string>;
}

const usePublish = () => {
  const [loading, setLoading] = React.useState(false);
  const publishDocument: PublishedDoc = (username, id, file, desc) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const storageRef = ref(storage, `publish/${username}/${id}`);

      try {
        const snap = await getDoc(doc(db, "publish", username));
        let data: any = [];
        if (snap.exists() && snap.data().hasOwnProperty("documents")) {
          data = snap.data().documents;
          const nameTaken = data.filter((doc: any) => doc.id === id).length;
          if (nameTaken) throw new Error("NAME_TAKEN");
        }

        const snapshot = await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);

        const document = {
          id,
          username,
          url,
          desc,
          createdAt: Timestamp.now(),
        };

        await setDoc(doc(db, "publish", username), {
          documents: [...data, document],
        });
        setLoading(false);
        resolve("success");
      } catch (e) {
        setLoading(false);
        reject(e);
      }
    });
  };

  const getPublishedDocuments: GetPublishedDocs = (username, setData) => {
    onSnapshot(doc(db, "publish", username), (snap) => {
      if (snap.exists() && snap.data().hasOwnProperty("documents"))
        setData(snap.data().documents);
      else setData([]);
    });
  };

  const deletePublishedDocument: DelPublishedDoc = (
    username,
    id,
    documents
  ) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      console.log(`publish/${username}/${id}`);
      try {
        await deleteObject(ref(storage, `publish/${username}/${id}`));
        const newDocs = documents.filter((doc) => doc.id !== id);
        await setDoc(doc(db, "publish", username), { documents: newDocs });
        setLoading(false);
        resolve("success");
      } catch (e) {
        setLoading(false);
        reject(e);
      }
    });
  };

  return {
    loading,
    publishDocument,
    getPublishedDocuments,
    deletePublishedDocument,
  };
};

export default usePublish;

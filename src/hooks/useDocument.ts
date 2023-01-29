import React from "react";
import {
  setDoc,
  Timestamp,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  collection,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { Schedual } from "../helpers/types";

interface DocExists {
  (userId: string, id: string): Promise<boolean>;
}
interface AddNewDoc {
  (userId: string, id: string, data: Schedual[]): Promise<boolean>;
}
interface GetDoc {
  (userId: string, id: string): Promise<boolean | DocumentData>;
}
interface GetAllDoc {
  (userId: string, setDocs: (a: Document[]) => void): void;
}
interface DeleteDoc {
  (userId: string, id: string): Promise<boolean>;
}
interface RenameDoc {
  (userId: string, id: string, newId: string): Promise<boolean>;
}

const useDocument = () => {
  const [loading, setLoading] = React.useState(false);

  // Document.
  const documentExists: DocExists = (userId, id) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "documents", userId + id));
      if (snapshot.exists()) resolve(true);
      resolve(false);
    });
  };

  const addNewDocument: AddNewDoc = (userId, id, data) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const document = {
        id,
        userId,
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
        data: JSON.stringify(data),
      };

      await setDoc(doc(db, "documents", userId + id), document);
      setLoading(false);
      resolve(true);
    });
  };

  const getDocument: GetDoc = (userId: string, id: string) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "documents", userId + id));
      if (snapshot.exists()) resolve(snapshot.data());
      resolve(false);
    });
  };

  const getAllDocuments: GetAllDoc = (
    userId: string,
    setDocs: (a: Document[]) => void
  ) => {
    onSnapshot(
      query(collection(db, "documents"), where("userId", "in", [userId])),
      (snap) => {
        const docs: Document[] = [];
        snap.forEach((doc) => {
          const data: any = doc.data();
          docs.push(data);
        });
        setDocs(docs);
      }
    );
  };

  const deleteDocument: DeleteDoc = (userId: string, id: string) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const snapshot = await deleteDoc(doc(db, "documents", userId + id));
      setLoading(false);
      resolve(true);
    });
  };

  const renameDocument: RenameDoc = (userId, id, newId) => {
    return new Promise(async (reject, resolve) => {
      setLoading(true);

      const document: any = await getDocument(userId, id);

      if (doc) {
        document.modifiedAt = Timestamp.now();
        document.id = newId;
        await deleteDocument(userId, id);
        await setDoc(doc(db, "documents", userId + newId), document);

        setLoading(false);
        resolve(true);
      }

      setLoading(false);
      reject(false);
    });
  };

  return {
    loading,
    addNewDocument,
    documentExists,
    getAllDocuments,
    getDocument,
    deleteDocument,
    renameDocument,
  };
};

export default useDocument;

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
import { Schedule } from "../helpers/types";

interface DocExists {
  (username: string, docId: string): Promise<boolean>;
}
interface AddNewDoc {
  (username: string, docId: string, data: Schedule[]): Promise<boolean>;
}
interface GetDoc {
  (username: string, docId: string): Promise<boolean | DocumentData>;
}
interface GetAllDoc {
  (username: string, setDocs: React.Dispatch<React.SetStateAction<any>>): void;
}
interface DeleteDoc {
  (username: string, docId: string): Promise<boolean>;
}
interface RenameDoc {
  (username: string, docId: string, newdocId: string): Promise<boolean>;
}

const useDocument = () => {
  const [loading, setLoading] = React.useState(false);

  // Document.
  const documentExists: DocExists = (username, docId) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "documents", username + docId));
      if (snapshot.exists()) resolve(true);
      resolve(false);
    });
  };

  const addNewDocument: AddNewDoc = (username, docId, data) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const document = {
        docId,
        username,
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
        data: JSON.stringify(data),
      };

      await setDoc(doc(db, "documents", username + docId), document);
      setLoading(false);
      resolve(true);
    });
  };

  const getDocument: GetDoc = (username, docId) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "documents", username + docId));
      if (snapshot.exists()) resolve(snapshot.data());
      resolve(false);
    });
  };

  const getAllDocuments: GetAllDoc = (username, setDocs) => {
    onSnapshot(
      query(collection(db, "documents"), where("username", "in", [username])),
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

  const deleteDocument: DeleteDoc = (username, docId) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const snapshot = await deleteDoc(doc(db, "documents", username + docId));
      setLoading(false);
      resolve(true);
    });
  };

  const renameDocument: RenameDoc = (username, docId, newDocId) => {
    return new Promise(async (reject, resolve) => {
      setLoading(true);

      const document: any = await getDocument(username, docId);

      if (doc) {
        document.modifiedAt = Timestamp.now();
        document.docId = newDocId;
        await deleteDocument(username, docId);
        await setDoc(doc(db, "documents", username + newDocId), document);

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

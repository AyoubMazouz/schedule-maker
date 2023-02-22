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
import { TEMPLATES } from "../helpers/templates";
import { Document } from "../helpers/types";

interface DocExists {
  (username: string, id: string): Promise<boolean>;
}
interface AddNewDoc {
  (username: string, id: string, template: string): Promise<boolean>;
}
interface UpdateDoc {
  (data: any, docInfo: any): Promise<boolean>;
}
interface GetDoc {
  (username: string, id: string): Promise<boolean | DocumentData>;
}
interface GetAllDoc {
  (
    username: string,
    setDocs: React.Dispatch<React.SetStateAction<any>>,
    setFavDocuments: React.Dispatch<React.SetStateAction<any>>
  ): void;
}
interface DeleteDoc {
  (username: string, id: string): Promise<boolean>;
}
interface DocumentInfo {
  (username: string, id: string, key: string, value: string): Promise<boolean>;
}

const useDocument = () => {
  const [loading, setLoading] = React.useState(false);

  // Document.
  const documentExists: DocExists = (username, id) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "documents", username + id));
      if (snapshot.exists()) resolve(true);
      resolve(false);
    });
  };

  const addNewDocument: AddNewDoc = (username, id, template) => {
    const data = JSON.parse(JSON.stringify([TEMPLATES[template].data]));
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const document = {
        id,
        username,
        template,
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
        data: JSON.stringify(data),
      };

      await setDoc(doc(db, "documents", username + id), document);
      setLoading(false);
      resolve(true);
    });
  };

  const updateDocument: UpdateDoc = (data, docInfo) => {
    return new Promise(async (resolve) => {
      setLoading(true);

      const docObj = {
        ...docInfo,
        modifiedAt: Timestamp.now(),
        data: JSON.stringify(data),
      };

      await updateDocument(
        doc(db, "documents", docInfo.username + docInfo.id),
        docObj
      );
      setLoading(false);
      resolve(true);
    });
  };

  const getDocument: GetDoc = (username, id) => {
    return new Promise(async (resolve) => {
      const snapshot = await getDoc(doc(db, "documents", username + id));
      if (snapshot.exists()) resolve(snapshot.data());
      resolve(false);
    });
  };

  const getAllDocuments: GetAllDoc = (username, setDocs, setFavDocuments) => {
    onSnapshot(
      query(collection(db, "documents"), where("username", "in", [username])),
      (snap) => {
        const docs: Document[] = [];
        snap.forEach((doc) => {
          const data: any = doc.data();
          docs.push(data);
        });
        docs.sort((a, b) => (a.id > b.id ? 1 : -1));
        setDocs(docs);
        setFavDocuments(docs.filter((d) => d.favorite));
      }
    );
  };

  const deleteDocument: DeleteDoc = (username, id) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const snapshot = await deleteDoc(doc(db, "documents", username + id));
      setLoading(false);
      resolve(true);
    });
  };

  const setDocumentInfo: DocumentInfo = (username, id, key, value) => {
    return new Promise(async (reject, resolve) => {
      setLoading(true);

      const document: any = await getDocument(username, id);

      if (doc) {
        document.modifiedAt = Timestamp.now();
        document[key] = value;
        await setDoc(doc(db, "documents", username + id), document);

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
    updateDocument,
    setDocumentInfo,
  };
};

export default useDocument;

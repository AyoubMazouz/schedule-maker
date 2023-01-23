import React from "react";
import {
    setDoc,
    Timestamp,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    collection,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useDocument = () => {
    const [loading, setLoading] = React.useState(false);

    // Document.
    const documentExists = (name) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", name));
            if (snapshot.exists()) resolve(true);
            resolve(false);
        });
    };

    const addNewDocument = (data, name) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            const document = {
                name,
                createdAt: Timestamp.now(),
                modifiedAt: Timestamp.now(),
                data: JSON.stringify(data),
            };

            await setDoc(doc(db, "documents", name), document);
            setLoading(false);
            resolve(true);
        });
    };

    const getDocument = (name) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", name));
            if (snapshot.exists()) resolve(snapshot.data());
        });
    };

    const getAllDocuments = (setDocs) => {
        onSnapshot(
            query(collection(db, "documents"), orderBy("createdAt")),
            (snap) => {
                const docs = [];
                snap.forEach((doc) => {
                    const data = doc.data();
                    docs.push(data);
                });
                setDocs(docs);
            }
        );
    };

    const deleteDocument = (name) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            const snapshot = await deleteDoc(doc(db, "documents", name));
            setLoading(false);
            resolve(snapshot);
        });
    };

    const renameDocument = (name, newName) => {
        return new Promise(async (reject, resolve) => {
            setLoading(true);

            const document = await getDocument(name);

            if (doc) {
                document.modifiedAt = Timestamp.now();
                document.name = newName;
                await deleteDocument(name);
                await setDoc(doc(db, "documents", newName), document);

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

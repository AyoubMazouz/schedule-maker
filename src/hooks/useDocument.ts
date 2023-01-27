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
} from "firebase/firestore";
import { db } from "../firebase";
import { Schedual } from "../types";

const useDocument = () => {
    const [loading, setLoading] = React.useState(false);

    // Document.
    const documentExists = (userId: string, id: number) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", userId + id));
            if (snapshot.exists()) resolve(true);
            resolve(false);
        });
    };

    const addNewDocument = (userId: string, id: number, data: Schedual[]) => {
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

    const getDocument = (userId: string, id: string) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", userId + id));
            if (snapshot.exists()) resolve(snapshot.data());
        });
    };

    const getAllDocuments = (
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

    const deleteDocument = (userId: string, id: string) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            const snapshot = await deleteDoc(doc(db, "documents", userId + id));
            setLoading(false);
            resolve(snapshot);
        });
    };

    const renameDocument = (userId: string, id: string, newId: string) => {
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

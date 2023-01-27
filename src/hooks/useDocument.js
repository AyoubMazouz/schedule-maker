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

const useDocument = () => {
    const [loading, setLoading] = React.useState(false);

    // Document.
    const documentExists = (userId, id) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", userId + id));
            if (snapshot.exists()) resolve(true);
            resolve(false);
        });
    };

    const addNewDocument = (userId, id, data) => {
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

    const getDocument = (userId, id) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", userId + id));
            if (snapshot.exists()) resolve(snapshot.data());
        });
    };

    const getAllDocuments = (userId, setDocs) => {
        onSnapshot(
            query(collection(db, "documents"), where("userId", "in", [userId])),
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

    const deleteDocument = (userId, id) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            const snapshot = await deleteDoc(doc(db, "documents", userId + id));
            setLoading(false);
            resolve(snapshot);
        });
    };

    const renameDocument = (userId, id, newId) => {
        return new Promise(async (reject, resolve) => {
            setLoading(true);

            const document = await getDocument(id);

            if (doc) {
                document.modifiedAt = Timestamp.now();
                document.id = newId;
                await deleteDocument(id);
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

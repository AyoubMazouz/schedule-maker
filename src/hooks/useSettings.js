import {
    setDoc,
    doc,
    getDoc,
    deleteDoc,
    Timestamp,
    onSnapshot,
    query,
    collection,
    orderBy,
} from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";

const useSettings = () => {
    const deleteAllLabels = () => {
        return new Promise(async (resolve, reject) => {
            await deleteDoc(doc(db, "settings", "labels"));
            resolve(true);
        });
    };

    const setLabels = (data) => {
        return setDoc(doc(db, "settings", "labels"), data);
    };

    const getLabels = () => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "settings", "labels"));

            if (snapshot.exists()) {
                const data = snapshot.data();

                if (data.hasOwnProperty("groups")) {
                    resolve(data);
                } else {
                    resolve({ groups: [], profNames: [], rooms: [] });
                }
            }
            resolve({ groups: [], profNames: [], rooms: [] });
        });
    };

    const publishDocument = (file, id) => {
        return new Promise(async (resolve, reject) => {
            const storageRef = ref(storage, "publishedDocuments/" + id);

            try {
                const snapshot = await uploadBytesResumable(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);

                const document = {
                    id,
                    url,
                    createdAt: Timestamp.now(),
                };

                await setDoc(doc(db, "publishedDocuments", id), document);

                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    };

    const getPublishedDocuments = (setDocs) => {
        onSnapshot(
            query(collection(db, "publishedDocuments"), orderBy("createdAt")),
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

    const deletePublishedDocument = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await deleteObject(ref(storage, `publishedDocuments/${id}`));
                await deleteDoc(doc(db, "publishedDocuments", id));
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    };

    return {
        deleteAllLabels,
        getLabels,
        publishDocument,
        getPublishedDocuments,
        deletePublishedDocument,
        setLabels,
    };
};

export default useSettings;

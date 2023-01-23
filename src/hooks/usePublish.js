import {
    setDoc,
    doc,
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

const usePublish = () => {
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

    const importSettings = (file, callback) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async (readerEvent) => {
            const json = readerEvent.target.result;
            const document = JSON.parse(json);
            callback(document);
        };
    };
    const exportSettings = (data, fileName) => {
        const jsonData = JSON.stringify(data);
        const link = document.createElement("a");
        link.href = "data:application/json," + jsonData;
        link.download = `${fileName}.schedual-maker.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        publishDocument,
        getPublishedDocuments,
        deletePublishedDocument,
        importSettings,
        exportSettings,
    };
};

export default usePublish;

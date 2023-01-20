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

                if (data.hasOwnProperty("trainers")) {
                    resolve(data);
                } else {
                    resolve({
                        faculties: [],
                        trainers: [],
                        rooms: [],
                        events: [],
                    });
                }
            }
            resolve({ faculties: [], trainers: [], rooms: [], events: [] });
        });
    };

    const addFaculty = (data, setData, value) => {
        const newLabels = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            faculties: [...data.faculties, value],
        };
        setData(newLabels);
    };
    const addTrainer = (data, setData, value) => {
        const labelsDoc = {
            rooms: data.rooms,
            faculties: data.faculties,
            events: data.events,
            trainers: [...data.trainers, value],
        };
        setData(labelsDoc);
    };
    const addRoom = (data, setData, value) => {
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            events: data.events,
            rooms: [...data.rooms, value],
        };
        setData(labelsDoc);
    };
    const addEvent = (data, setData, value) => {
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            rooms: data.rooms,
            events: [...data.events, value],
        };
        setData(labelsDoc);
    };

    const deleteTrainer = (data, setData, id) => {
        const trainers = data.trainers.filter((trainer) => trainer.id !== id);
        const labelsDoc = {
            faculties: data.faculties,
            rooms: data.rooms,
            events: data.events,
            trainers,
        };
        setData(labelsDoc);
    };
    const deleteFaculty = (data, setData, id) => {
        const faculties = data.faculties.filter((faculty) => faculty.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            faculties,
        };
        setData(labelsDoc);
    };
    const deleteRoom = (data, setData, id) => {
        const rooms = data.rooms.filter((room) => room.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            events: data.events,
            rooms,
        };
        setData(labelsDoc);
    };
    const deleteEvent = (data, setData, id) => {
        const events = data.events.filter((event) => event.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            rooms: data.rooms,
            events,
        };
        setData(labelsDoc);
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
        deleteRoom,
        deleteFaculty,
        deleteTrainer,
        deleteEvent,
        addRoom,
        addTrainer,
        addFaculty,
        addEvent,
    };
};

export default useSettings;

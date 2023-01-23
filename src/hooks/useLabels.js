import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const useLabels = () => {
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
        const faculties = [...data.faculties, value].sort(
            (a, b) => a.name > b.name
        );
        const newLabels = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            faculties,
        };
        setData(newLabels);
    };
    const addTrainer = (data, setData, value) => {
        const trainers = [...data.trainers, value].sort(
            (a, b) => a.name > b.name
        );
        const labelsDoc = {
            rooms: data.rooms,
            faculties: data.faculties,
            events: data.events,
            trainers,
        };
        setData(labelsDoc);
    };
    const addRoom = (data, setData, value) => {
        const rooms = [...data.rooms, value].sort((a, b) => a.name > b.name);
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            events: data.events,
            rooms,
        };
        setData(labelsDoc);
    };
    const addEvent = (data, setData, value) => {
        const events = [...data.events, value].sort((a, b) => a.name > b.name);
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            rooms: data.rooms,
            events,
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
    const updateFaculty = (data, setData, id, value) => {
        let faculties = data.faculties.filter((event) => event.id !== id);
        faculties = [...faculties, value].sort((a, b) => a.name > b.name);
        const labelsDoc = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            faculties,
        };
        setData(labelsDoc);
    };
    const updateTrainer = (data, setData, id, value) => {
        const trainers = data.trainers.filter((trainer) => trainer.id !== id);
        const labelsDoc = {
            rooms: data.rooms,
            events: data.events,
            faculties: data.faculties,
            trainers: [...trainers, value],
        };
        setData(labelsDoc);
    };
    const updateRoom = (data, setData, id, value) => {
        const rooms = data.rooms.filter((room) => room.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            events: data.events,
            faculties: data.faculties,
            rooms: [...rooms, value],
        };
        setData(labelsDoc);
    };
    const updateEvent = (data, setData, id, value) => {
        const events = data.events.filter((event) => event.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            faculties: data.faculties,
            rooms: data.rooms,
            events: [...events, value],
        };
        setData(labelsDoc);
    };

    return {
        getLabels,
        setLabels,
        deleteAllLabels,
        deleteRoom,
        deleteFaculty,
        deleteTrainer,
        deleteEvent,
        addRoom,
        addTrainer,
        addFaculty,
        addEvent,
        updateFaculty,
        updateTrainer,
        updateRoom,
        updateEvent,
    };
};

export default useLabels;

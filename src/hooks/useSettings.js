import { Timestamp } from "firebase/firestore";

const useSettings = () => {
    const addLevel = (data, setData, value) => {
        const levels = [...data.levels, value].sort((a, b) => a.name > b.name);
        const newLabels = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            levels,
        };
        setData(newLabels);
    };
    const addTrainer = (data, setData, value) => {
        const trainers = [...data.trainers, value].sort(
            (a, b) => a.name > b.name
        );
        const labelsDoc = {
            rooms: data.rooms,
            levels: data.levels,
            events: data.events,
            trainers,
        };
        setData(labelsDoc);
    };
    const addRoom = (data, setData, value) => {
        const rooms = [...data.rooms, value].sort((a, b) => a.name > b.name);
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            events: data.events,
            rooms,
        };
        setData(labelsDoc);
    };
    const addEvent = (data, setData, value) => {
        const events = [...data.events, value].sort((a, b) => a.name > b.name);
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            rooms: data.rooms,
            events,
        };
        setData(labelsDoc);
    };

    const deleteTrainer = (data, setData, id) => {
        const trainers = data.trainers.filter((trainer) => trainer.id !== id);
        const labelsDoc = {
            levels: data.levels,
            rooms: data.rooms,
            events: data.events,
            trainers,
        };
        setData(labelsDoc);
    };
    const deleteLevel = (data, setData, id) => {
        const levels = data.levels.filter((level) => level.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            levels,
        };
        setData(labelsDoc);
    };
    const deleteRoom = (data, setData, id) => {
        const rooms = data.rooms.filter((room) => room.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            events: data.events,
            rooms,
        };
        setData(labelsDoc);
    };
    const deleteEvent = (data, setData, id) => {
        const events = data.events.filter((event) => event.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            rooms: data.rooms,
            events,
        };
        setData(labelsDoc);
    };
    const updateLevel = (data, setData, id, value) => {
        let levels = data.levels.filter((level) => level.id !== id);
        levels = [...levels, value].sort((a, b) => a.name > b.name);
        const labelsDoc = {
            trainers: data.trainers,
            rooms: data.rooms,
            events: data.events,
            levels,
        };
        setData(labelsDoc);
    };
    const updateTrainer = (data, setData, id, value) => {
        const trainers = data.trainers.filter((trainer) => trainer.id !== id);
        const labelsDoc = {
            rooms: data.rooms,
            events: data.events,
            levels: data.levels,
            trainers: [...trainers, value],
        };
        setData(labelsDoc);
    };
    const updateRoom = (data, setData, id, value) => {
        const rooms = data.rooms.filter((room) => room.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            events: data.events,
            levels: data.levels,
            rooms: [...rooms, value],
        };
        setData(labelsDoc);
    };
    const updateEvent = (data, setData, id, value) => {
        const events = data.events.filter((event) => event.id !== id);
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            rooms: data.rooms,
            events: [...events, value],
        };
        setData(labelsDoc);
    };
    const exportSettings = (data) => {
        const jsonData = JSON.stringify(data);
        const link = document.createElement("a");
        link.href = "data:application/json," + jsonData;
        link.download = `schedual-maker.settings.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const importSettigs = (file, callback) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async (readerEvent) => {
            const json = readerEvent.target.result;
            const document = await JSON.parse(json);
            const d = {
                createdAt: Timestamp.now(),
                modiefiedAt: Timestamp.now(),
            };
            document.levels = document.levels.map((l) => ({
                ...l,
                ...d,
            }));
            document.trainers = document.trainers.map((t) => ({
                ...t,
                ...d,
            }));
            document.rooms = document.rooms.map((r) => ({
                ...r,
                ...d,
            }));
            document.events = document.events.map((e) => ({
                ...e,
                ...d,
            }));
            callback(document);
        };
    };

    return {
        addLevel,
        addRoom,
        addTrainer,
        addEvent,
        updateLevel,
        updateTrainer,
        updateRoom,
        updateEvent,
        deleteLevel,
        deleteRoom,
        deleteTrainer,
        deleteEvent,
        exportSettings,
        importSettigs,
    };
};

export default useSettings;

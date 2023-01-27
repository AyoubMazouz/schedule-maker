import { Timestamp } from "firebase/firestore";

const useSettings = () => {
    const addLevel = (data, setData, value, numOfGrps, modules) => {
        const alreadyExists = data.levels.filter(
            (t) => t.value === value
        ).length;
        if (alreadyExists) return false;
        const newLevel = {
            id: data.levels.length,
            value,
            numOfGrps,
            modules,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };
        const levels = [...data.levels, newLevel].sort(
            (a, b) => a.value > b.value
        );
        const labelsDoc = {
            rooms: data.rooms,
            trainers: data.trainers,
            events: data.events,
            levels,
        };
        setData(labelsDoc);
        return true;
    };
    const addTrainer = (data, setData, value, preferedRooms) => {
        const alreadyExists = data.trainers.filter(
            (t) => t.value === value
        ).length;
        if (alreadyExists) return false;
        const newTrainer = {
            id: data.trainers.length,
            value,
            preferedRooms,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };
        const trainers = [...data.trainers, newTrainer].sort(
            (a, b) => a.value > b.value
        );
        const labelsDoc = {
            rooms: data.rooms,
            levels: data.levels,
            events: data.events,
            trainers,
        };
        setData(labelsDoc);
        return true;
    };
    const addRoom = (data, setData, value) => {
        const alreadyExists = data.rooms.filter(
            (r) => r.value === value
        ).length;
        if (alreadyExists) return false;
        const newRoom = {
            id: data.rooms.length,
            value,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };
        const rooms = [...data.rooms, newRoom].sort(
            (a, b) => a.value > b.value
        );
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            events: data.events,
            rooms,
        };
        setData(labelsDoc);
        return true;
    };
    const addEvent = (data, setData, value) => {
        const alreadyExists = data.events.filter(
            (e) => e.value === value
        ).length;
        if (alreadyExists) return false;
        const newEvent = {
            id: data.events.length,
            value,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };
        const events = [...data.events, newEvent].sort(
            (a, b) => a.value > b.value
        );
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            rooms: data.rooms,
            events: events,
        };
        setData(labelsDoc);
        return true;
    };
    // Delete
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
    // Update
    const updateLevel = (data, setData, level, value, numOfGrps, modules) => {
        let alreadyExists = false;
        const levels = data.levels.filter((l) => {
            if (l.value === value && l.id !== level.id) alreadyExists = true;
            return l.id !== level.id;
        });
        if (alreadyExists) return false;
        const newLevel = {
            id: level.id,
            value,
            numOfGrps,
            modules,
            createdAt: level.createdAt,
            modifiedAt: Timestamp.now(),
        };
        const labelsDoc = {
            rooms: data.rooms,
            events: data.events,
            trainers: data.trainers,
            levels: [...levels, newLevel],
        };
        setData(labelsDoc);
        return true;
    };
    const updateTrainer = (data, setData, trainer, value, preferedRooms) => {
        let alreadyExists = false;
        const trainers = data.trainers.filter((t) => {
            if (t.value === value && t.id !== trainer.id) alreadyExists = true;
            return t.id !== trainer.id;
        });
        if (alreadyExists) return false;
        const newTrainer = {
            id: trainer.id,
            value: value,
            preferedRooms,
            createdAt: trainer.createdAt,
            modifiedAt: Timestamp.now(),
        };
        const labelsDoc = {
            rooms: data.rooms,
            events: data.events,
            levels: data.levels,
            trainers: [...trainers, newTrainer],
        };
        setData(labelsDoc);
        return true;
    };
    const updateRoom = (data, setData, room, value) => {
        let alreadyExists = false;
        const rooms = data.rooms.filter((r) => {
            if (r.value === value && r.id !== room.id) alreadyExists = true;
            return r.id !== room.id;
        });
        if (alreadyExists) return false;
        const newRoom = {
            id: room.id,
            value: value,
            createdAt: room.createdAt,
            modifiedAt: Timestamp.now(),
        };
        const labelsDoc = {
            trainers: data.trainers,
            events: data.events,
            levels: data.levels,
            rooms: [...rooms, newRoom],
        };
        setData(labelsDoc);
        return true;
    };
    const updateEvent = (data, setData, event, value) => {
        let alreadyExists = false;
        const events = data.events.filter((e) => {
            if (e.value === value && e.id !== event.id) alreadyExists = true;
            return e.id !== event.id;
        });
        if (alreadyExists) return false;
        const newEvent = {
            id: event.id,
            value: value,
            createdAt: event.createdAt,
            modifiedAt: Timestamp.now(),
        };
        const labelsDoc = {
            trainers: data.trainers,
            levels: data.levels,
            rooms: data.rooms,
            events: [...events, newEvent],
        };
        setData(labelsDoc);
        return true;
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
                modifiedAt: Timestamp.now(),
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

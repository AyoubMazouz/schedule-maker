import { Timestamp } from "firebase/firestore";
import { LabelsType, Level, Trainer, Room, Event } from "../helpers/types";

interface AddLevel {
  (
    data: LabelsType,
    value: string,
    numOfGrps: string,
    modules: string[],
    desc: string
  ): boolean | LabelsType;
}
interface AddTrainer {
  (data: LabelsType, value: string, preferredRooms: string[], desc: string):
    | boolean
    | LabelsType;
}
interface AddRoom {
  (data: LabelsType, value: string, desc: string): boolean | LabelsType;
}
interface AddEvent {
  (data: LabelsType, value: string, desc: string): boolean | LabelsType;
}
interface Delete {
  (data: LabelsType, id: string): void;
}
interface UpdateLevel {
  (
    data: LabelsType,
    level: Level,
    value: string,
    numOfGrps: string,
    modules: string[],
    desc: string
  ): boolean | LabelsType;
}
interface UpdateTrainer {
  (
    data: LabelsType,
    trainer: Trainer,
    value: string,
    preferredRooms: string[],
    desc: string
  ): boolean | LabelsType;
}
interface UpdateRoom {
  (data: LabelsType, room: Room, value: string, desc: string):
    | boolean
    | LabelsType;
}
interface UpdateEvent {
  (data: LabelsType, event: Event, value: string, desc: string):
    | boolean
    | LabelsType;
}

const useSettings = () => {
  // Add.
  const addLevel: AddLevel = (data, value, numOfGrps, modules, desc) => {
    const alreadyExists = data.levels.filter(
      (l: Level) => l.value === value
    ).length;
    if (alreadyExists) return false;
    const newLevel = {
      value,
      numOfGrps,
      modules,
      desc,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const levels = [...data.levels, newLevel].sort((a: Level, b: Level) =>
      a.value > b.value ? 1 : -1
    );
    const labelsDoc = {
      rooms: data.rooms,
      trainers: data.trainers,
      events: data.events,
      levels,
    };
    return labelsDoc;
  };
  const addTrainer: AddTrainer = (data, value, preferredRooms, desc) => {
    const alreadyExists = data.trainers.filter(
      (t: Trainer) => t.value === value
    ).length;
    if (alreadyExists) return false;
    const newTrainer = {
      value,
      desc,
      preferredRooms,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const trainers = [...data.trainers, newTrainer].sort((a, b) =>
      a.value > b.value ? 1 : -1
    );
    const labelsDoc = {
      rooms: data.rooms,
      levels: data.levels,
      events: data.events,
      trainers,
    };
    return labelsDoc;
  };
  const addRoom: AddRoom = (data, value, desc) => {
    const alreadyExists = data.rooms.filter((r) => r.value === value).length;
    if (alreadyExists) return false;
    const newRoom = {
      value,
      desc,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const rooms = [...data.rooms, newRoom].sort((a, b) =>
      a.value > b.value ? 1 : -1
    );
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      events: data.events,
      rooms,
    };
    return labelsDoc;
  };
  const addEvent: AddEvent = (data, value, desc) => {
    const alreadyExists = data.events.filter((e) => e.value === value).length;
    if (alreadyExists) return false;
    const newEvent = {
      desc,
      value,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const events = [...data.events, newEvent].sort((a, b) =>
      a.value > b.value ? 1 : -1
    );
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      rooms: data.rooms,
      events: events,
    };
    return labelsDoc;
  };
  // Delete
  const deleteLevel: Delete = (data, value) => {
    const levels = data.levels.filter((level) => level.value !== value);
    const labelsDoc = {
      trainers: data.trainers,
      rooms: data.rooms,
      events: data.events,
      levels,
    };
    return labelsDoc;
  };
  const deleteTrainer: Delete = (data, value) => {
    const trainers = data.trainers.filter((trainer) => trainer.value !== value);
    const labelsDoc = {
      levels: data.levels,
      rooms: data.rooms,
      events: data.events,
      trainers,
    };
    return labelsDoc;
  };
  const deleteRoom: Delete = (data, value) => {
    const rooms = data.rooms.filter((room) => room.value !== value);
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      events: data.events,
      rooms,
    };
    return labelsDoc;
  };
  const deleteEvent: Delete = (data, value) => {
    const events = data.events.filter((event) => event.value !== value);
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      rooms: data.rooms,
      events,
    };
    return labelsDoc;
  };
  // Update
  const updateLevel: UpdateLevel = (
    data,
    level,
    value,
    numOfGrps,
    modules,
    desc
  ) => {
    let alreadyExists = false;
    const levels = data.levels.filter((l) => {
      if (l.value === value && l.value !== level.value) alreadyExists = true;
      return l.value !== level.value;
    });
    if (alreadyExists) return false;
    const newLevel = {
      ...level,
      value,
      numOfGrps,
      modules,
      desc,
      modifiedAt: Timestamp.now(),
    };
    const labelsDoc = {
      rooms: data.rooms,
      events: data.events,
      trainers: data.trainers,
      levels: [...levels, newLevel].sort((a, b) =>
        a.value > b.value ? 1 : -1
      ),
    };
    return labelsDoc;
  };
  const updateTrainer: UpdateTrainer = (
    data,
    trainer,
    value,
    preferredRooms,
    desc
  ) => {
    let alreadyExists = false;
    const trainers = data.trainers.filter((t) => {
      if (t.value === value && t.value !== trainer.value) alreadyExists = true;
      return t.value !== trainer.value;
    });
    if (alreadyExists) return false;
    const newTrainer = {
      value,
      desc,
      preferredRooms,
      createdAt: trainer.createdAt,
      modifiedAt: Timestamp.now(),
    };
    const labelsDoc = {
      rooms: data.rooms,
      events: data.events,
      levels: data.levels,
      trainers: [...trainers, newTrainer].sort((a, b) =>
        a.value > b.value ? 1 : -1
      ),
    };
    return labelsDoc;
  };
  const updateRoom: UpdateRoom = (data, room, value, desc) => {
    let alreadyExists = false;
    const rooms = data.rooms.filter((r) => {
      if (r.value === value && r.value !== room.value) alreadyExists = true;
      return r.value !== room.value;
    });
    if (alreadyExists) return false;
    const newRoom = {
      value,
      desc,
      createdAt: room.createdAt,
      modifiedAt: Timestamp.now(),
    };
    const labelsDoc = {
      trainers: data.trainers,
      events: data.events,
      levels: data.levels,
      rooms: [...rooms, newRoom].sort((a, b) => (a.value > b.value ? 1 : -1)),
    };
    return labelsDoc;
  };
  const updateEvent: UpdateEvent = (data, event, value, desc) => {
    let alreadyExists = false;
    const events = data.events.filter((e) => {
      if (e.value === value && e.value !== event.value) alreadyExists = true;
      return e.value !== event.value;
    });
    if (alreadyExists) return false;
    const newEvent = {
      ...event,
      value,
      desc,
      modifiedAt: Timestamp.now(),
    };
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      rooms: data.rooms,
      events: [...events, newEvent].sort((a, b) =>
        a.value > b.value ? 1 : -1
      ),
    };
    return labelsDoc;
  };
  const exportSettings = (data: LabelsType) => {
    const jsonData = JSON.stringify(data);
    const link = document.createElement("a");
    link.href = "data:application/json," + jsonData;
    link.download = `schedual-maker.settings.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importSettings = (file: any, callback: (a: LabelsType) => void) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = async (readerEvent: any) => {
      const json = readerEvent.target.result;
      const document = JSON.parse(json);
      const d = {
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
      };
      document.levels = document.levels.map((l: Level) => ({
        ...l,
        ...d,
      }));
      document.trainers = document.trainers.map((t: Trainer) => ({
        ...t,
        ...d,
      }));
      document.rooms = document.rooms.map((r: Room) => ({
        ...r,
        ...d,
      }));
      document.events = document.events.map((e: Event) => ({
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
    importSettings,
  };
};

export default useSettings;

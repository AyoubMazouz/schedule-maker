import { Timestamp } from "firebase/firestore";
import { LabelsType, Level, Trainer, Room, Event } from "../helpers/types";
import Resizer from "react-image-file-resizer";

interface AddLevel {
  (
    data: LabelsType,
    id: string,
    numOfGrps: string,
    modules: string[],
    desc: string
  ): boolean | LabelsType;
}
interface AddTrainer {
  (data: LabelsType, id: string, preferredRooms: string[], desc: string):
    | boolean
    | LabelsType;
}
interface AddRoom {
  (data: LabelsType, id: string, desc: string): boolean | LabelsType;
}
interface AddEvent {
  (data: LabelsType, id: string, desc: string): boolean | LabelsType;
}
interface Delete {
  (data: LabelsType, id: string): void;
}
interface UpdateLevel {
  (
    data: LabelsType,
    level: Level,
    id: string,
    numOfGrps: string,
    modules: string[],
    desc: string
  ): boolean | LabelsType;
}
interface UpdateTrainer {
  (
    data: LabelsType,
    trainer: Trainer,
    id: string,
    preferredRooms: string[],
    desc: string
  ): boolean | LabelsType;
}
interface UpdateRoom {
  (data: LabelsType, room: Room, id: string, desc: string):
    | boolean
    | LabelsType;
}
interface UpdateEvent {
  (data: LabelsType, event: Event, id: string, desc: string):
    | boolean
    | LabelsType;
}

interface ResizeImg {
  (
    file: File,
    size: number,
    callback: (a: string | File | Blob | ProgressEvent<FileReader>) => void
  ): void;
}

const useSettings = () => {
  // Add.
  const addLevel: AddLevel = (data, id, numOfGrps, modules, desc) => {
    const alreadyExists = data.levels.filter(
      (l: Level) => l.id === id
    ).length;
    if (alreadyExists) return false;
    const newLevel = {
      id,
      numOfGrps,
      modules,
      desc,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const levels = [...data.levels, newLevel].sort((a: Level, b: Level) =>
      a.id > b.id ? 1 : -1
    );
    const labelsDoc = {
      rooms: data.rooms,
      trainers: data.trainers,
      events: data.events,
      levels,
    };
    return labelsDoc;
  };
  const addTrainer: AddTrainer = (data, id, preferredRooms, desc) => {
    const alreadyExists = data.trainers.filter(
      (t: Trainer) => t.id === id
    ).length;
    if (alreadyExists) return false;
    const newTrainer = {
      id,
      desc,
      preferredRooms,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const trainers = [...data.trainers, newTrainer].sort((a, b) =>
      a.id > b.id ? 1 : -1
    );
    const labelsDoc = {
      rooms: data.rooms,
      levels: data.levels,
      events: data.events,
      trainers,
    };
    return labelsDoc;
  };
  const addRoom: AddRoom = (data, id, desc) => {
    const alreadyExists = data.rooms.filter((r) => r.id === id).length;
    if (alreadyExists) return false;
    const newRoom = {
      id,
      desc,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const rooms = [...data.rooms, newRoom].sort((a, b) =>
      a.id > b.id ? 1 : -1
    );
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      events: data.events,
      rooms,
    };
    return labelsDoc;
  };
  const addEvent: AddEvent = (data, id, desc) => {
    const alreadyExists = data.events.filter((e) => e.id === id).length;
    if (alreadyExists) return false;
    const newEvent = {
      desc,
      id,
      createdAt: Timestamp.now(),
      modifiedAt: Timestamp.now(),
    };
    const events = [...data.events, newEvent].sort((a, b) =>
      a.id > b.id ? 1 : -1
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
  const deleteLevel: Delete = (data, id) => {
    const levels = data.levels.filter((level) => level.id !== id);
    const labelsDoc = {
      trainers: data.trainers,
      rooms: data.rooms,
      events: data.events,
      levels,
    };
    return labelsDoc;
  };
  const deleteTrainer: Delete = (data, id) => {
    const trainers = data.trainers.filter((trainer) => trainer.id !== id);
    const labelsDoc = {
      levels: data.levels,
      rooms: data.rooms,
      events: data.events,
      trainers,
    };
    return labelsDoc;
  };
  const deleteRoom: Delete = (data, id) => {
    const rooms = data.rooms.filter((room) => room.id !== id);
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      events: data.events,
      rooms,
    };
    return labelsDoc;
  };
  const deleteEvent: Delete = (data, id) => {
    const events = data.events.filter((event) => event.id !== id);
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
    id,
    numOfGrps,
    modules,
    desc
  ) => {
    let alreadyExists = false;
    const levels = data.levels.filter((l) => {
      if (l.id === id && l.id !== level.id) alreadyExists = true;
      return l.id !== level.id;
    });
    if (alreadyExists) return false;
    const newLevel = {
      ...level,
      id,
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
        a.id > b.id ? 1 : -1
      ),
    };
    return labelsDoc;
  };
  const updateTrainer: UpdateTrainer = (
    data,
    trainer,
    id,
    preferredRooms,
    desc
  ) => {
    let alreadyExists = false;
    const trainers = data.trainers.filter((t) => {
      if (t.id === id && t.id !== trainer.id) alreadyExists = true;
      return t.id !== trainer.id;
    });
    if (alreadyExists) return false;
    const newTrainer = {
      id,
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
        a.id > b.id ? 1 : -1
      ),
    };
    return labelsDoc;
  };
  const updateRoom: UpdateRoom = (data, room, id, desc) => {
    let alreadyExists = false;
    const rooms = data.rooms.filter((r) => {
      if (r.id === id && r.id !== room.id) alreadyExists = true;
      return r.id !== room.id;
    });
    if (alreadyExists) return false;
    const newRoom = {
      id,
      desc,
      createdAt: room.createdAt,
      modifiedAt: Timestamp.now(),
    };
    const labelsDoc = {
      trainers: data.trainers,
      events: data.events,
      levels: data.levels,
      rooms: [...rooms, newRoom].sort((a, b) => (a.id > b.id ? 1 : -1)),
    };
    return labelsDoc;
  };
  const updateEvent: UpdateEvent = (data, event, id, desc) => {
    let alreadyExists = false;
    const events = data.events.filter((e) => {
      if (e.id === id && e.id !== event.id) alreadyExists = true;
      return e.id !== event.id;
    });
    if (alreadyExists) return false;
    const newEvent = {
      ...event,
      id,
      desc,
      modifiedAt: Timestamp.now(),
    };
    const labelsDoc = {
      trainers: data.trainers,
      levels: data.levels,
      rooms: data.rooms,
      events: [...events, newEvent].sort((a, b) =>
        a.id > b.id ? 1 : -1
      ),
    };
    console.log(newEvent);
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

  const resizeImg: ResizeImg = async (file, size, callback) => {
    let res: string | File | Blob | ProgressEvent<FileReader> = "";
    try {
      await Resizer.imageFileResizer(
        file,
        size,
        size,
        "JPEG",
        86,
        0,
        callback,
        "base64"
      );
    } catch (err) {
      console.log(err);
    }
    return res;
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
    resizeImg,
  };
};

export default useSettings;

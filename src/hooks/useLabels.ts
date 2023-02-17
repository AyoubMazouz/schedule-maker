import {
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { LabelsType, Level, Schedule } from "../helpers/types";

interface DelAllLabels {
  (username: string): Promise<boolean>;
}
interface SetLabels {
  (username: string, data: LabelsType): Promise<any>;
}
interface GetLabels {
  (username: string): Promise<LabelsType | DocumentData>;
}

interface GetGroups {
  (data: Schedule[], labelsData: LabelsType, currSchedule: number): string[][];
}
interface GetTrainers {
  (
    data: Schedule[],
    labelsData: LabelsType,
    selectedCell: number[]
  ): string[][];
}
interface GetRooms {
  (
    data: Schedule[],
    labelsData: LabelsType,
    selectedCell: number[]
  ): string[][];
}
interface GetModules {
  (data: Schedule[], labelsData: LabelsType, selectedCell: number[]): string[];
}
interface GetEvents {
  (labelsData: LabelsType): string[];
}

const useLabels = () => {
  const deleteAllLabels: DelAllLabels = (username: string) => {
    return new Promise(async (resolve, reject) => {
      await deleteDoc(doc(db, "labels", username));
      resolve(true);
    });
  };

  const setLabels: SetLabels = (username, data) => {
    return setDoc(doc(db, "labels", username), data);
  };

  const getLabels: GetLabels = (username: string) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(doc(db, "labels", username));

      if (snapshot.exists()) {
        const data = snapshot.data();

        if (data.hasOwnProperty("levels")) {
          resolve(data);
        } else {
          resolve({
            levels: [],
            trainers: [],
            rooms: [],
            events: [],
          });
        }
      }
      resolve({ levels: [], trainers: [], rooms: [], events: [] });
    });
  };

  const getGroups: GetGroups = (data, labelsData, currSchedule) => {
    const groups: string[] = [];
    // Generate groups base on level and numOfGrps.
    labelsData.levels.forEach((level) => {
      for (let i = 1; i <= parseInt(level.numOfGrps); i++)
        groups.push(`${level.value} ${i}`);
    });
    // Get unavailable groups.
    const unavailableGroups: string[] = [];
    for (let i = 0; i < data.length; i++) {
      const grp = data[i].group;
      if (grp && grp !== data[currSchedule].group) unavailableGroups.push(grp);
    }
    // Get available groups without including unavailable groups.
    const availableGroups = groups.filter(
      (g) => !unavailableGroups.includes(g)
    );
    return [availableGroups, unavailableGroups];
  };

  const getModules: GetModules = (data, labelsData, selectedCell) => {
    const level = data[selectedCell[0]].group.split(" ")[0];
    const newLevels = labelsData.levels.filter((l: Level) => l.value === level);
    if (!newLevels.length) return [];
    return newLevels[0].modules;
  };

  const getTrainers: GetTrainers = (data, labelsData, selectedCell) => {
    const availableTrainers: string[] = [];
    const unavailableTrainers: string[] = [];
    const currTrainer =
      data[selectedCell[0]].schedule[selectedCell[1]][selectedCell[2]][0];
    // Get unavailable trainers.
    for (let s = 0; s < data.length; s++) {
      const trainer = data[s].schedule[selectedCell[1]][selectedCell[2]][0];
      if (trainer && trainer !== currTrainer) unavailableTrainers.push(trainer);
    }
    // Get available trainers.
    for (let t = 0; t < labelsData.trainers.length; t++) {
      const trainer = labelsData.trainers[t].value;
      if (!unavailableTrainers.includes(trainer))
        availableTrainers.push(trainer);
    }
    return [availableTrainers, unavailableTrainers];
  };

  const getRooms: GetRooms = (data, labelsData, selectedCell) => {
    const availableRooms: string[] = [];
    const unavailableRooms: string[] = [];
    const preferredRooms = ["teams"];
    const [x, y, z] = selectedCell;
    const currRoom = data[x].schedule[y][z][2];
    const currTrainer =
      data[selectedCell[0]].schedule[selectedCell[1]][selectedCell[2]][0];
    // Get unavailable rooms.
    for (let s = 0; s < data.length; s++) {
      const room = data[s].schedule[y][z][2];
      if (room && room !== currRoom && room !== "Teams")
        unavailableRooms.push(room);
    }
    // If trainer exists, Get preferred rooms without including unavailable rooms.
    if (currTrainer) {
      for (let p = 0; p < labelsData.trainers.length; p++) {
        const trainer = labelsData.trainers[p];
        if (currTrainer === trainer.value) {
          const rooms = trainer.preferredRooms.filter(
            (r) => r !== currRoom && !unavailableRooms.includes(r)
          );
          preferredRooms.push(...rooms);
        }
      }
    }
    // Get available rooms without including unavailable & preferred rooms.
    for (let r = 0; r < labelsData.rooms.length; r++) {
      const room = labelsData.rooms[r].value;
      if (!unavailableRooms.includes(room) && !preferredRooms.includes(room))
        availableRooms.push(room);
    }

    return [preferredRooms, availableRooms, unavailableRooms];
  };

  const getEvents: GetEvents = (labelsData) =>
    labelsData.events.map((e) => e.value);
  return {
    getLabels,
    setLabels,
    deleteAllLabels,
    getGroups,
    getTrainers,
    getRooms,
    getEvents,
    getModules,
  };
};

export default useLabels;

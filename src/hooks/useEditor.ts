import React from "react";
import { EMPTY_SCHEDULE } from "../helpers/constants";
import { TEMPLATES } from "../helpers/templates";
import { LabelsType, Level, Schedule, Template } from "../helpers/types";
import useDocument from "./useDocument";

interface ImportDoc {
  (file: any, callback: (a: Schedule[]) => void): void;
}
interface ClearCell {
  (
    data: Schedule[],
    setData: (a: Schedule[]) => void,
    fusionMode: boolean,
    scheduleIndex: number,
    dayIndex: number,
    sessionIndex: number
  ): boolean;
}
interface EditField {
  (
    data: Schedule[],
    setData: (a: Schedule[]) => void,
    fusionMode: boolean,
    scheduleIndex: number,
    dayIndex: number,
    sessionIndex: number,
    row: number,
    value: string
  ): boolean;
}
interface EditScheduleGrp {
  (
    data: Schedule[],
    setData: (a: Schedule[]) => void,
    scheduleIndex: number,
    value: string
  ): boolean;
}
interface AddNewSchedule {
  (data: Schedule[], template: Template): any;
}
interface DeleteSchedule {
  (data: Schedule[], setData: (a: Schedule[]) => void, id: string): boolean;
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

const useEditor = () => {
  const { addNewDocument, loading } = useDocument();

  const exportDocument = (data: Schedule[], fileName: string) => {
    const jsonData = JSON.stringify(data);
    const link = document.createElement("a");
    link.href = "data:application/json," + jsonData;
    link.download = `${fileName}.schedule-maker.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importDocument: ImportDoc = (file, callback) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = async (readerEvent: any) => {
      const json = readerEvent.target.result;
      const document = JSON.parse(json);
      callback(document);
    };
  };
  const importDocumentAsFile = async (userId: string, file: any) => {
    // importDocument(file, (doc) => addNewDocument(userId, file.name, doc));
  };

  const clearCell: ClearCell = (
    data,
    setData,
    fusionMode,
    scheduleIndex,
    dayIndex,
    sessionIndex
  ) => {
    const copiedData = data.map((sch) => sch);
    copiedData[scheduleIndex].schedule[dayIndex][sessionIndex] = [
      "",
      "",
      "",
      "",
    ];

    if (fusionMode) {
      const offset = sessionIndex % 2 === 0 ? 1 : -1;
      copiedData[scheduleIndex].schedule[dayIndex][sessionIndex + offset] = [
        "",
        "",
        "",
        "",
      ];
    }

    setData(copiedData);
    return true;
  };

  // schedule.
  const editField: EditField = (
    data,
    setData,
    fusionMode,
    x,
    y,
    z,
    row,
    value
  ) => {
    let [hoursCount, error] = [0, false];

    const copiedData = data.map((sch, schIndex) => {
      if (row === 1) return sch;
      return {
        ...sch,
        schedule: sch.schedule.map((d, dIndex) => {
          return d.map((ses, sesIndex) => {
            // Check if Prof available.
            if (
              ses[0] === value &&
              schIndex !== x &&
              dIndex === y &&
              sesIndex === z &&
              ses[2].toLowerCase() !== "teams"
            ) {
              error = true;
              return ses;
            }
            // Check if Room available.
            else if (
              ses[2] === value &&
              schIndex !== x &&
              dIndex === y &&
              sesIndex === z &&
              ses[2].toLowerCase() !== "teams"
            ) {
              error = true;
              return ses;
            }

            // Count Total Hours.
            if (schIndex === x)
              if (ses[0] && ses[1] && ses[2]) hoursCount += 2.5;
            return ses;
          });
        }),
      };
    });

    if (error) return false;

    if (fusionMode) {
      const offset = z % 2 === 0 ? 1 : -1;
      copiedData[x].schedule[y][z + offset][row] = value;
    }

    copiedData[x].totalHours = hoursCount.toString();
    copiedData[x].schedule[y][z][row] = value;
    setData(copiedData);
    return true;
  };

  const editScheduleGrp: EditScheduleGrp = (
    data,
    setData,
    scheduleIndex,
    value
  ) => {
    let error = false;
    const copiedData = data.map((sch) => {
      if (sch.group === value) {
        error = true;
        return sch;
      }
      return sch;
    });
    if (error) return false;

    copiedData[scheduleIndex].group = value;
    setData(copiedData);
    return true;
  };

  const addNewSchedule: AddNewSchedule = (data, template) => {
    const newSchedule = JSON.parse(JSON.stringify(TEMPLATES[template].data));
    if (data.length === 0) return [newSchedule];

    if (!data[data.length - 1].group) return false;

    return [...data, newSchedule];
  };

  const deleteSchedule: DeleteSchedule = (data, setData, id) => {
    const newData = data.filter((sch) => sch.group !== id);
    if (data.length === newData.length) return false;
    setData(newData);
    return true;
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

  const undo = (
    data: any,
    setData: any,
    history: any,
    hIndex: any,
    setHistory: any,
    setHIndex: any,
    fusionMode: any
  ) => {
    if (hIndex === 0) return;
    const h = history[hIndex - 1];
    if (h.type === "INSERT") {
      const newData = data.map((sch: any) => {
        sch.schedule[h.y][h.z][h.row] = h.prev;
        if (fusionMode) {
          const offset = h.z % 2 === 0 ? 1 : -1;
          sch.schedule[h.y][h.z + offset][h.row] = h.prev;
        }
        return sch;
      });
      setData(newData);
      setHIndex((x: any) => --x);
    }
  };
  const redo = (
    data: any,
    setData: any,
    history: any,
    hIndex: any,
    setHistory: any,
    setHIndex: any,
    fusionMode: any
  ) => {
    if (hIndex === history.length) return;
    const h = history[hIndex];
    if (h.type === "INSERT") {
      const newData = data.map((sch: any) => {
        sch.schedule[h.y][h.z][h.row] = h.next;
        if (fusionMode) {
          const offset = h.z % 2 === 0 ? 1 : -1;
          sch.schedule[h.y][h.z + offset][h.row] = h.next;
        }
        return sch;
      });
      setData(newData);
      setHIndex((x: any) => ++x);
    }
  };

  // Record Action for undo and redo.
  const record = (
    history: any,
    hIndex: any,
    setHistory: any,
    setHIndex: any,
    x: any,
    y: any,
    z: any,
    row: any,
    next: any,
    prev: any
  ) => {
    // If new data is inserted and the pointer is in the middle.
    // Remove all action that it index is greater than pointer index.
    if (hIndex !== history.length) setHistory((x: any) => x.slice(0, hIndex));
    const action = {
      type: "INSERT",
      fusionMode: true,
      x,
      y,
      z,
      row,
      next,
      prev,
    };
    setHistory((x: any) => [...x, action]);
    setHIndex((x: any) => ++x);
  };

  return {
    loading,
    exportDocument,
    importDocument,
    importDocumentAsFile,
    editField,
    clearCell,
    editScheduleGrp,
    deleteSchedule,
    addNewSchedule,
    getGroups,
    getTrainers,
    getRooms,
    getEvents,
    getModules,
    undo,
    redo,
    record,
  };
};

export default useEditor;

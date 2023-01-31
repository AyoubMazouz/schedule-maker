import { EMPTY_SCHEDUAL } from "../helpers/constants";
import { LabelsType, Level, Schedual } from "../helpers/types";
import useDocument from "./useDocument";

interface ImportDoc {
  (file: any, callback: (a: Schedual[]) => void): void;
}
interface ClearCell {
  (
    data: Schedual[],
    setData: (a: Schedual[]) => void,
    fusionMode: boolean,
    schedualIndex: number,
    dayIndex: number,
    sessionIndex: number
  ): boolean;
}
interface EditField {
  (
    data: Schedual[],
    setData: (a: Schedual[]) => void,
    fusionMode: boolean,
    schedualIndex: number,
    dayIndex: number,
    sessionIndex: number,
    row: number,
    value: string
  ): boolean;
}
interface EditSchedualGrp {
  (
    data: Schedual[],
    setData: (a: Schedual[]) => void,
    schedualIndex: number,
    value: string
  ): boolean;
}
interface AddNewSchedual {
  (data: Schedual[], setData: (a: Schedual[]) => void): boolean;
}
interface DeleteSchedual {
  (data: Schedual[], setData: (a: Schedual[]) => void, id: string): boolean;
}

interface GetGroups {
  (data: Schedual[], labelsData: LabelsType, currSchedual: number): string[][];
}
interface GetTrainers {
  (
    data: Schedual[],
    labelsData: LabelsType,
    selectedCell: number[]
  ): string[][];
}
interface GetRooms {
  (
    data: Schedual[],
    labelsData: LabelsType,
    selectedCell: number[]
  ): string[][];
}
interface GetModules {
  (data: Schedual[], labelsData: LabelsType, selectedCell: number[]): string[];
}
interface GetEvents {
  (labelsData: LabelsType): string[];
}

const useEditor = () => {
  const { addNewDocument, loading } = useDocument();

  const exportDocument = (data: Schedual[], fileName: string) => {
    const jsonData = JSON.stringify(data);
    const link = document.createElement("a");
    link.href = "data:application/json," + jsonData;
    link.download = `${fileName}.schedual-maker.json`;
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
    importDocument(file, (doc) => addNewDocument(userId, file.name, doc));
  };

  const clearCell: ClearCell = (
    data,
    setData,
    fusionMode,
    schedualIndex,
    dayIndex,
    sessionIndex
  ) => {
    const copiedData = data.map((sch) => sch);
    copiedData[schedualIndex].schedual[dayIndex][sessionIndex] = [
      "",
      "",
      "",
      "",
    ];

    if (fusionMode) {
      const offset = sessionIndex % 2 === 0 ? 1 : -1;
      copiedData[schedualIndex].schedual[dayIndex][sessionIndex + offset] = [
        "",
        "",
        "",
        "",
      ];
    }

    setData(copiedData);
    return true;
  };

  // Schedual.
  const editField: EditField = (
    data,
    setData,
    fusionMode,
    schedualIndex,
    dayIndex,
    sessionIndex,
    row,
    value
  ) => {
    let [hoursCount, error] = [0, false];

    const copiedData = data.map((sch, schIndex) => {
      if (row === 1) return sch;
      return {
        ...sch,
        schedual: sch.schedual.map((d, dIndex) => {
          return d.map((ses, sesIndex) => {
            // Check if Prof available.
            if (
              ses[0] === value &&
              schIndex !== schedualIndex &&
              dIndex === dayIndex &&
              sesIndex === sessionIndex &&
              ses[2].toLowerCase() !== "teams"
            ) {
              error = true;
              return ses;
            }
            // Check if Room available.
            else if (
              ses[2] === value &&
              schIndex !== schedualIndex &&
              dIndex === dayIndex &&
              sesIndex === sessionIndex &&
              ses[2].toLowerCase() !== "teams"
            ) {
              error = true;
              return ses;
            }

            // Count Total Hours.
            if (schIndex === schedualIndex)
              if (ses[0] && ses[1] && ses[2]) hoursCount += 2.5;
            return ses;
          });
        }),
      };
    });

    if (error) return false;

    if (fusionMode) {
      const offset = sessionIndex % 2 === 0 ? 1 : -1;
      copiedData[schedualIndex].schedual[dayIndex][sessionIndex + offset][row] =
        value;
    }

    copiedData[schedualIndex].totalHours = hoursCount.toString();
    copiedData[schedualIndex].schedual[dayIndex][sessionIndex][row] = value;
    setData(copiedData);
    return true;
  };

  const editSchedualGrp: EditSchedualGrp = (
    data,
    setData,
    schedualIndex,
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

    copiedData[schedualIndex].group = value;
    setData(copiedData);
    return true;
  };

  const addNewSchedual: AddNewSchedual = (data, setData) => {
    const newSchedule = JSON.parse(JSON.stringify(EMPTY_SCHEDUAL));
    if (data.length === 0) {
      setData([newSchedule]);
      return true;
    }

    if (!data[data.length - 1].group) return false;

    setData([...data, newSchedule]);
    return true;
  };

  const deleteSchedual: DeleteSchedual = (data, setData, id) => {
    const newData = data.filter((sch) => sch.group !== id);
    if (data.length === newData.length) return false;
    setData(newData);
    return true;
  };

  const getGroups: GetGroups = (data, labelsData, currSchedual) => {
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
      if (grp && grp !== data[currSchedual].group) unavailableGroups.push(grp);
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
    return newLevels[0].modules;
  };

  const getTrainers: GetTrainers = (data, labelsData, selectedCell) => {
    const availableTrainers: string[] = [];
    const unavailableTrainers: string[] = [];
    const currTrainer =
      data[selectedCell[0]].schedual[selectedCell[1]][selectedCell[2]][0];
    // Get unavailable trainers.
    for (let s = 0; s < data.length; s++) {
      const trainer = data[s].schedual[selectedCell[1]][selectedCell[2]][0];
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
    const currRoom = data[x].schedual[y][z][2];
    const currTrainer =
      data[selectedCell[0]].schedual[selectedCell[1]][selectedCell[2]][0];
    // Get unavailable rooms.
    for (let s = 0; s < data.length; s++) {
      const room = data[s].schedual[y][z][2];
      if (room && room !== currRoom && room !== "Teams")
        unavailableRooms.push(room);
    }
    // If trainer exists, Get preferred rooms without including unavailable rooms.
    if (currTrainer) {
      for (let p = 0; p < labelsData.trainers.length; p++) {
        const trainer = labelsData.trainers[p];
        if (currTrainer === trainer.value) {
          const rooms = trainer.preferedRooms.filter(
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
    loading,
    exportDocument,
    importDocument,
    importDocumentAsFile,
    editField,
    clearCell,
    editSchedualGrp,
    deleteSchedual,
    addNewSchedual,
    getGroups,
    getTrainers,
    getRooms,
    getEvents,
    getModules,
  };
};

export default useEditor;

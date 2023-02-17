import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { useEditorContext } from "../../../Contexts/EditorContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { DAYS_TEXT, SESSIONS_TEXT } from "../../../helpers/constants";
import { deepClone } from "../../../helpers/util";
import useDataExchange from "../../../hooks/useDataExchange";
import useDocument from "../../../hooks/useDocument";
import useEditor from "../../../hooks/useEditor";
import useLabels from "../../../hooks/useLabels";
import { usePdf } from "../../../hooks/usePdf";
import useUndoRedo from "./useUndoRedo";

const useEditorNavBar = () => {
  const {
    data,
    setData,
    setModel,
    setAlert,
    labelsData,
    loadLabelsData,
    docInfo,
  } = useGlobalContext();
  const {
    saved,
    setSaved,
    fusionMode,
    selectedCell,
    history,
    hIndex,
    setHistory,
    setHIndex,
    setCurrMenu,
    clipboard,
    setClipboard,
  } = useEditorContext();
  const { getModules, getTrainers, getRooms, getEvents } = useLabels();
  const { importDocument, exportDocument } = useDataExchange();
  const { record, undo, redo } = useUndoRedo();
  const { updateDocument } = useDocument();
  const { exportAsPdf } = usePdf();
  const { currUser } = useAuth();

  const { docId } = useParams();
  const navigate = useNavigate();

  const [availableTrainers, setAvailableTrainers] = React.useState<string[]>(
    []
  );
  const [unavailableTrainers, setUnavailableTrainers] = React.useState<
    string[]
  >([]);
  const [preferredRooms, setPreferredRooms] = React.useState<string[]>([]);
  const [unavailableRooms, setUnavailableRooms] = React.useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = React.useState<string[]>([]);
  const [modules, setModules] = React.useState<string[]>([]);
  const [events, setEvents] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadLabelsData(currUser.username);
  }, []);

  React.useEffect(() => {
    if (selectedCell) {
      // Get modules depending on current group.
      const modules = getModules(data, labelsData, selectedCell);
      setModules(modules);

      // Get Events.
      const events = getEvents(labelsData);
      setEvents(events);

      // Get Trainers.
      const [availableTrainers, unavailableTrainers] = getTrainers(
        data,
        labelsData,
        selectedCell
      );
      setUnavailableTrainers(unavailableTrainers);
      setAvailableTrainers(availableTrainers);

      // Get Rooms.
      const [preferredRooms, availableRooms, unavailableRooms] = getRooms(
        data,
        labelsData,
        selectedCell
      );
      setPreferredRooms(preferredRooms);
      setAvailableRooms(availableRooms);
      setUnavailableRooms(unavailableRooms);
    }
  }, [selectedCell, data]);

  const handleExit = async () => {
    if (saved) navigate("/documents");
    else setModel({ type: "exit", to: "/documents" });
    setCurrMenu(null);
  };
  const handleGoToSettings = async () => {
    if (saved) navigate("/settings/labels");
    else setModel({ type: "exit", to: "/settings/labels" });
    setCurrMenu(null);
  };

  const handleDownload = () => {
    exportAsPdf(data, docId as string);
    setAlert("success", "Download has started...");
    setCurrMenu(null);
  };

  const handleExport = () => {
    exportDocument(data, docId as string);
    setCurrMenu(null);
  };

  const handleNewDoc = () => {
    setModel({ type: "newdoc" });
  };

  const handleImport = async (e: any) => {
    importDocument(e.target.files[0], setData);
    setSaved(false);
  };

  const handleSave = async () => {
    setCurrMenu(null);
    await updateDocument(data, docInfo);
    setSaved(true);
  };

  const handleClearCell = () => {
    const [x, y, z] = selectedCell;
    // Record for undo and redo.
    record(history, setHistory, hIndex, setHIndex, {
      type: "CLEAR_CELL",
      prev: data[x].schedule[y][z],
      x,
      y,
      z,
      fusionMode,
    });
    const copiedData = data.map((sch: any) => sch);
    copiedData[x].schedule[y][z] = ["", "", "", ""];

    if (fusionMode) {
      const offset = z % 2 === 0 ? 1 : -1;
      copiedData[x].schedule[y][z + offset] = ["", "", "", ""];
    }
    setData(copiedData);
    setSaved(false);
  };

  const editFieldHandler = (row: number, value: string) => {
    const [x, y, z] = selectedCell;
    let [hoursCount, error] = [0, false];

    // Record for undo and redo.
    record(history, setHistory, hIndex, setHIndex, {
      type: "TABLE_INSERT",
      prev: data[x].schedule[y][z][row],
      next: value,
      x,
      y,
      z,
      row,
      fusionMode,
    });

    const copiedData = deepClone(data);
    copiedData.map((sch: any, schIndex: any) => {
      if (row === 1 || row === 3) return sch;
      return {
        ...sch,
        schedule: sch.schedule.map((d: any, dIndex: any) => {
          return d.map((ses: any, sesIndex: any) => {
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

    if (fusionMode) {
      const offset = z % 2 === 0 ? 1 : -1;
      copiedData[x].schedule[y][z + offset][row] = value;
    }
    copiedData[x].totalHours = hoursCount.toString();
    copiedData[x].schedule[y][z][row] = value;

    const sessionTextSplited = SESSIONS_TEXT[z].split("-");
    if (error) {
      if (row === 0) {
        setAlert(
          "warn",
          `The professor "${value}" is not available on "${DAYS_TEXT[y]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" working with the group "${data[x].group}" in classRoom number "${value}".`
        );
      } else if (row === 2) {
        setAlert(
          "warn",
          `The Room number "${value}" is not available on "${DAYS_TEXT[y]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" it is ocupied by the group "${value}".`
        );
      }
    } else {
      setData(copiedData);
      setSaved(false);
    }
  };

  const handleUndo = () => {
    undo(data, setData, history, hIndex, setHIndex);
    setSaved(false);
  };

  const handleRedo = () => {
    redo(data, setData, history, hIndex, setHIndex);
    setSaved(false);
  };

  const handleCopy = () => {
    const [x, y, z] = selectedCell,
      currSession = data[x].schedule[y][z];
    if (
      currSession[0].length > 0 ||
      currSession[1].length > 0 ||
      currSession[2].length > 0 ||
      currSession[3].length > 0
    ) {
      setClipboard(currSession);
    } else setAlert("warn", "cell is empty!");
  };
  const handlePaste = () => {
    const [x, y, z] = selectedCell;
    let hoursCount = 0;
    const sessionTextSplited = SESSIONS_TEXT[z].split("-");
    const copiedData = deepClone(data);

    for (let i = 0; i < copiedData.length; i++) {
      for (let j = 0; j < copiedData[i].schedule.length; j++) {
        for (let k = 0; k < copiedData[i].schedule[j].length; k++) {
          const session = copiedData[i].schedule[j][k];
          let errors = [];
          if (
            session[0] === clipboard[0] &&
            i !== x &&
            j === y &&
            k === z &&
            session[2].toLowerCase() !== "teams"
          ) {
            errors.push(
              `The professor "${clipboard[0]}" is not available on "${DAYS_TEXT[y]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" working with the group "${data[x].group}" in classRoom number "${clipboard[0]}".`
            );
          }

          // Check if Room available.
          if (
            session[2] === clipboard[2] &&
            i !== x &&
            j === y &&
            k === z &&
            session[2].toLowerCase() !== "teams"
          ) {
            errors.push(
              `The Room number "${clipboard[2]}" is not available on "${DAYS_TEXT[y]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" it is ocupied by the group "${clipboard[2]}".`
            );
          }

          // Count Total Hours.
          if (i === x && session[0] && session[1] && session[2])
            hoursCount += 2.5;

          // Check Errors.
          if (errors.length > 0) {
            errors.forEach((message) => setAlert("warn", message));
            return;
          }
        }
      }
    }

    if (fusionMode) {
      const offset = z % 2 === 0 ? 1 : -1;
      copiedData[x].schedule[y][z + offset][0] = clipboard[0];
      copiedData[x].schedule[y][z + offset][1] = clipboard[1];
      copiedData[x].schedule[y][z + offset][2] = clipboard[2];
      copiedData[x].schedule[y][z + offset][3] = clipboard[3];
    }
    copiedData[x].totalHours = hoursCount.toString();
    copiedData[x].schedule[y][z][0] = clipboard[0];
    copiedData[x].schedule[y][z][1] = clipboard[1];
    copiedData[x].schedule[y][z][2] = clipboard[2];
    copiedData[x].schedule[y][z][3] = clipboard[3];

    setData(copiedData);
    setSaved(false);
  };

  return {
    availableTrainers,
    unavailableTrainers,
    preferredRooms,
    unavailableRooms,
    availableRooms,
    modules,
    events,
    handleExit,
    handleGoToSettings,
    handleDownload,
    handleExport,
    handleNewDoc,
    handleClearCell,
    editFieldHandler,
    handleUndo,
    handleRedo,
    handleCopy,
    handlePaste,
    handleSave,
    handleImport,
  };
};

export default useEditorNavBar;

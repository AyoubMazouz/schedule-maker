import React from "react";
// Contexts.
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { useEditorContext } from "../../../Contexts/EditorContext";
// Hooks.
import useEditor from "../../../hooks/useEditor";
import useUndoRedo from "../EditorNavBar/useUndoRedo";
import useLabels from "../../../hooks/useLabels";
const useEditorSideBar = () => {
  const {
    history,
    hIndex,
    setHistory,
    setHIndex,
    setSaved,
    currSchedule,
    setCurrSchedule,
    setSelectedCell,
    saved,
  } = useEditorContext();
  const { data, setData, setAlert, labelsData, docInfo } = useGlobalContext();
  const { addNewSchedule, editScheduleGrp, deleteSchedule } = useEditor();
  const { getGroups } = useLabels();
  const { record } = useUndoRedo();

  // Prevent user from leaving the page with unsaved changes.
  React.useEffect(() => {
    if (saved) window.onbeforeunload = null;
    else
      window.onbeforeunload = () => {
        const message =
          "You can't leave this page with unsaved changes, if you leave changes will be lost.";
        setAlert("warn", message);
        return message;
      };
  }, [saved]);

  const [availableGroups, setAvailableGroups] = React.useState<string[]>([]);
  const [unavailableGroups, setUnavailableGroups] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    const [availableGroups, unavailableGroups] = getGroups(
      data,
      labelsData,
      currSchedule
    );
    setAvailableGroups(availableGroups);
    setUnavailableGroups(unavailableGroups);
  }, [currSchedule, labelsData]);

  const addNewScheduleHandler = () => {
    record(history, setHistory, hIndex, setHIndex, {
      type: "ADD_SCHEDULE",
      template: docInfo.template,
      setCurrSchedule,
      setSelectedCell,
    });
    const res = addNewSchedule(data, docInfo.template);
    if (res) {
      setCurrSchedule(data.length);
      setSelectedCell((x: number[]) => (x ? [data.length, x[1], x[2]] : null));
      setData(res);
      setSaved(false);
    } else {
      setAlert(
        "warn",
        "You should finish the previous table or at least fill the 'group' field."
      );
    }
  };

  const editScheduleGrpHandler = (scheduleIndex: number, value: string) => {
    // Record for undo and redo.
    record(history, setHistory, hIndex, setHIndex, {
      type: "INFO_INSERT",
      prev: data[scheduleIndex].group,
      next: value,
      x: scheduleIndex,
    });
    const res = editScheduleGrp(data, setData, scheduleIndex, value);
    if (res) {
      setSaved(false);
    } else {
      setAlert("warn", "You have already created a Schedule for this group");
    }
  };

  const deleteScheduleHandler = (scheduleIndex: number) => {
    // Record for undo and redo.
    record(history, setHistory, hIndex, setHIndex, {
      type: "DEL_SCHEDULE",
      prev: data[scheduleIndex],
      x: scheduleIndex,
      setCurrSchedule,
      setSelectedCell,
    });
    const res = deleteSchedule(data, setData, data[scheduleIndex].group);
    if (res) {
      const currSchedule = scheduleIndex === 0 ? 0 : scheduleIndex - 1;
      setCurrSchedule(currSchedule);
      setSaved(false);
    }
  };

  return {
    availableGroups,
    unavailableGroups,
    addNewScheduleHandler,
    editScheduleGrpHandler,
    deleteScheduleHandler,
  };
};

export default useEditorSideBar;

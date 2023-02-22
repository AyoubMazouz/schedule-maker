import React from "react";
// Types.
import { Schedule } from "../../../helpers/types";
// Contexts.
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { useEditorContext } from "../../../Contexts/EditorContext";
// Hooks.
import useUndoRedo from "../EditorNavBar/useUndoRedo";
import useLabels from "../../../hooks/useLabels";
// Helpers.
import { TEMPLATES } from "../../../helpers/templates";
import { deepClone } from "../../../helpers/util";

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
    // Record for undo and redo.
    record(history, setHistory, hIndex, setHIndex, {
      type: "ADD_SCHEDULE",
      template: docInfo.template,
      setCurrSchedule,
      setSelectedCell,
    });

    const newSchedule = deepClone(TEMPLATES[docInfo.template].data);
    if (data.length === 0) return;
    if (!data[data.length - 1].group) {
      setAlert(
        "warn",
        "You should finish the previous table or at least fill the 'group' field."
      );
      return;
    }
    setData([...data, newSchedule]);
    setCurrSchedule(data.length);
    setSelectedCell((x: number[]) => (x ? [data.length, x[1], x[2]] : null));
    setSaved(false);
  };

  const editScheduleGrpHandler = (scheduleIndex: number, value: string) => {
    // Record for undo and redo.
    record(history, setHistory, hIndex, setHIndex, {
      type: "INFO_INSERT",
      prev: data[scheduleIndex].group,
      next: value,
      x: scheduleIndex,
    });

    const copiedData = deepClone(data);
    for (let i = 0; i < copiedData.length; i++) {
      if (copiedData[i].group === value) {
        setAlert("warn", "You have already created a Schedule for this group");
        return;
      }
    }

    copiedData[scheduleIndex].group = value;
    setData(copiedData);
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

    const copiedData = data.filter(
      (s: Schedule) => s.group !== data[scheduleIndex].group
    );
    if (data.length !== copiedData.length) {
      setData(copiedData);
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

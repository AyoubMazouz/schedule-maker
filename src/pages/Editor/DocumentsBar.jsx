import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcBin, IcPlus, IcTime } from "../../helpers/icons";
import { useEditorContext } from "../../Contexts/EditorContext";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import useUndoRedo from "./EditorNavBar/useUndoRedo";
import useLabels from "../../hooks/useLabels";

const DocumentsBar = () => {
  const {
    history,
    hIndex,
    setHistory,
    setHIndex,
    setSaved,
    currSchedule,
    setCurrSchedule,
    menuRef,
    currMenu,
    setCurrMenu,
    setSelectedCell,
  } = useEditorContext();
  const { data, setData, setAlert, labelsData, docInfo } = useGlobalContext();
  const { addNewSchedule, editScheduleGrp, deleteSchedule } = useEditor();
  const { getGroups } = useLabels();
  const { record } = useUndoRedo();

  const [availableGroups, setAvailableGroups] = React.useState([]);
  const [unavailableGroups, setUnavailableGroups] = React.useState([]);

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
      setSelectedCell((x) => (x ? [data.length, x[1], x[2]] : null));
      setData(res);
      setSaved(false);
    } else {
      setAlert(
        "warn",
        "You should finish the previous table or at least fill the 'group' field."
      );
    }
  };

  const editScheduleGrpHandler = (scheduleIndex, value) => {
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

  const deleteScheduleHandler = (scheduleIndex) => {
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

  return (
    <div className="flex flex-col p-2 gap-y-3">
      {data.map((schedule, scheduleIndex) =>
        scheduleIndex === currSchedule ? (
          <div
            key={schedule.group}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-[1px] border-dark/50 bg-primary p-2"
          >
            <div className="flex items-center justify-center w-6 h-6 font-semibold rounded-full bg-light text-primary ">
              {scheduleIndex + 1}
            </div>
            <Select
              values={availableGroups}
              value={schedule.group}
              notRecommended={unavailableGroups}
              label="groups"
              onChange={(v) => editScheduleGrpHandler(scheduleIndex, v)}
              styles="text-light border-light/50"
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
            />
            <Button
              Icon={IcBin}
              label={["delete schedule"]}
              styles="text-light"
              onClick={(e) => deleteScheduleHandler(scheduleIndex)}
            />
          </div>
        ) : (
          <button
            key={schedule.group}
            className="flex items-center gap-2 rounded-lg border-[1px] border-dark/50 bg-light p-2 text-sm font-semibold transition-all duration-300 hover:bg-secondary"
            onClick={(e) => setCurrSchedule(scheduleIndex)}
          >
            <div className="flex items-center justify-center w-6 h-6 font-bold rounded-full bg-primary text-light">
              {scheduleIndex + 1}
            </div>
            <div className="">{schedule.group}</div>
            <div className="flex items-center ml-auto gap-x-1 text-primary">
              <span>{schedule.totalHours}</span>
              <IcTime className="icon" />
            </div>
          </button>
        )
      )}
      <Button
        Icon={IcPlus}
        text="add"
        onClick={addNewScheduleHandler}
        styles="flex justify-center"
      />
    </div>
  );
};

export default DocumentsBar;

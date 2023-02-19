import React from "react";
// Contexts.
import { useGlobalContext } from "../../../Contexts/GlobalContext";
// Hooks.
import useEditorSideBar from "./useEditorSideBar";
// Components.
import { IcBin, IcPlus, IcTime } from "../../../helpers/icons";
import { useEditorContext } from "../../../Contexts/EditorContext";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { Schedule } from "../../../helpers/types";

const EditorSideBar = () => {
  const { data } = useGlobalContext();
  const { currSchedule, setCurrSchedule, menuRef, currMenu, setCurrMenu } =
    useEditorContext();
  const {
    availableGroups,
    unavailableGroups,
    addNewScheduleHandler,
    editScheduleGrpHandler,
    deleteScheduleHandler,
  } = useEditorSideBar();
  return (
    <div className="flex flex-col gap-y-3 p-2">
      {data.map((schedule: Schedule, scheduleIndex: number) =>
        scheduleIndex === currSchedule ? (
          <div
            key={schedule.group}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-[1px] border-dark/50 bg-primary p-2"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-light font-semibold text-primary ">
              {scheduleIndex + 1}
            </div>
            <Select
              values={availableGroups}
              value={schedule.group}
              notRecommended={unavailableGroups}
              label="groups"
              onChange={(v: string) => editScheduleGrpHandler(scheduleIndex, v)}
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
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-light">
              {scheduleIndex + 1}
            </div>
            <div className="">{schedule.group}</div>
            <div className="ml-auto flex items-center gap-x-1 text-primary">
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

export default EditorSideBar;

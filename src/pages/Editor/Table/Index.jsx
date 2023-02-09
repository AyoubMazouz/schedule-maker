import React from "react";
import { useEditorContext } from "../../../Contexts/EditorContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { TEMPLATES } from "../../../helpers/templates";
import Cell from "./Cell";

const Table = () => {
  const { data, docInfo } = useGlobalContext();
  const { currSchedule } = useEditorContext();

  if (data.length === 0) return null;
  // if (!data[currSchedule].group) return "please select a group first!";

  return (
    <>
      {/* Head */}
      <div className="flex">
        <div className="grid min-w-[5.45rem] place-items-center font-semibold">
          <span className="grid w-8 h-8 text-lg font-bold rounded-full place-items-center bg-primary text-light">
            {currSchedule + 1}
          </span>
          <span className="leading-4 text-center">
            {data[currSchedule].group}
          </span>
        </div>
        <div className="flex w-full">
          {TEMPLATES[docInfo.template].labels.sessions.map((value) => (
            <div
              key={value}
              className="col-span-2 grid w-full min-w-[6rem] place-items-center bg-primary font-semibold text-white"
            >
              {value}
            </div>
          ))}
        </div>
      </div>
      {/* Body */}
      <div className="flex">
        <div className="w-[6rem]">
          {TEMPLATES[docInfo.template].labels.days.map((value) => (
            <div
              key={value}
              className="flex h-[6rem] items-center justify-between bg-primary p-1 font-semibold text-light"
            >
              {value}
            </div>
          ))}
        </div>
        <div className="w-full">
          {data[currSchedule].schedule.map((day, dayIndex) => (
            <div key={`day:${dayIndex}`} className="flex">
              {day.map((session, sessionIndex) => (
                <div
                  key={`${session.join("")}${sessionIndex}`}
                  className="w-full"
                >
                  <Cell
                    {...{
                      session,
                      scheduleIndex: currSchedule,
                      dayIndex,
                      sessionIndex,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Table;

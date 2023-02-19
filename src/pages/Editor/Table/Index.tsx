import React from "react";
// Contexts.
import { useEditorContext } from "../../../Contexts/EditorContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
// Helpers.
import { TEMPLATES } from "../../../helpers/templates";
// Components.
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
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-lg font-bold text-light">
            {currSchedule + 1}
          </span>
          <span className="text-center leading-4">
            {data[currSchedule].group}
          </span>
        </div>
        <div className="flex w-full">
          {TEMPLATES[docInfo.template].labels.sessions.map((value: string) => (
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
          {TEMPLATES[docInfo.template].labels.days.map((value: string) => (
            <div
              key={value}
              className="flex h-[6rem] items-center justify-between bg-primary p-1 font-semibold text-light"
            >
              {value}
            </div>
          ))}
        </div>
        <div className="w-full">
          {data[currSchedule].schedule.map(
            (day: string[][], dayIndex: number) => (
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
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Table;

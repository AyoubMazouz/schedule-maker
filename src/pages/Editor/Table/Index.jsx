import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { DAYS_TEXT, SESSIONS_TEXT } from "../../../helpers/constants";
import Cell from "./Cell";

const Table = ({ schedualIndex }) => {
  const { data } = useGlobalContext();

  if (!data[schedualIndex].group) return "please select a group first!";

  return (
    <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl border-2 border-dark/50 shadow-lg">
      <div id={`doc_${schedualIndex}`} className="w-full">
        <div className="w-full">
          <div className="grid w-full grid-cols-9">
            <div className="grid place-items-center font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-lg font-bold text-light">
                {schedualIndex + 1}
              </span>
              <span className="text-center leading-4">
                {data[schedualIndex].group}
              </span>
            </div>
            <div className="col-span-2 grid place-items-center bg-primary py-6 font-semibold text-white">
              {SESSIONS_TEXT[0]}
            </div>
            <div className="col-span-2 grid place-items-center bg-primary py-6 font-semibold text-white">
              {SESSIONS_TEXT[1]}
            </div>
            <div className="col-span-2 grid place-items-center bg-primary py-6 font-semibold text-white">
              {SESSIONS_TEXT[2]}
            </div>
            <div className="col-span-2 grid place-items-center bg-primary py-6 font-semibold text-white">
              {SESSIONS_TEXT[3]}
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-9 overflow-hidden">
            <div>
              {DAYS_TEXT.map((day) => (
                <div
                  key={day}
                  className="flex h-[5.5rem] items-center justify-between bg-primary pl-4 pr-1 font-semibold text-light"
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            <div className="col-span-8 grid grid-cols-4">
              {data[schedualIndex].schedual.map((day, dayIndex) => {
                const group = data[schedualIndex].group;
                const faculty = group.slice(0, group.length - 4);
                return day.map((session, sessionIndex) => (
                  <Cell
                    key={`${session.join("")}${sessionIndex}`}
                    {...{
                      session,
                      schedualIndex,
                      dayIndex,
                      sessionIndex,
                    }}
                  />
                ));
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

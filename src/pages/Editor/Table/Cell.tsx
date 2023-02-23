import React from "react";
// Contexts.
import { useEditorContext } from "../../../Contexts/EditorContext";
import { ZOOM } from "../../../helpers/constants";
import { View } from "../../../helpers/types";

interface Type {
  ({
    session,
    scheduleIndex,
    dayIndex,
    sessionIndex,
    view,
  }: {
    session: string[];
    scheduleIndex: number;
    dayIndex: number;
    sessionIndex: number;
    view: View;
  }): JSX.Element;
}

const Cell: Type = ({
  session,
  scheduleIndex,
  dayIndex,
  sessionIndex,
  view,
}) => {
  const { setSelectedCell, selectedCell, fusionMode } = useEditorContext();

  const isComplete = () => {
    if (session[0] && session[1] && session[2]) return "bg-dark/10";
    else if (session[0] || session[1] || session[2]) return "bg-secondary";
    return "";
  };

  const getBorder = () => {
    if (selectedCell) {
      const [x, y, z] = selectedCell;
      if (scheduleIndex === x && dayIndex === y) {
        if (sessionIndex === z) {
          if (fusionMode) {
            if (sessionIndex % 2 === 0) {
              return "border-2 border-r-0 border-emerald-500";
            }
            return "border-2 border-l-0 border-emerald-500";
          }
          return "border-2 border-emerald-500";
        } else if (
          fusionMode &&
          sessionIndex % 2 !== 0 &&
          sessionIndex - 1 === z
        ) {
          return "border-2 border-l-0 border-emerald-500";
        } else if (
          fusionMode &&
          sessionIndex % 2 === 0 &&
          sessionIndex + 1 === z
        ) {
          return "border-2 border-r-0 border-emerald-500";
        }
      }
    }

    if (dayIndex === 0 && sessionIndex === 0)
      return "border-[1px] border-dark/50 border-t-0 border-l-0";
    if (dayIndex === 0 && sessionIndex === 3)
      return "border-[1px] border-dark/50 border-t-0 border-r-0";
    if (dayIndex === 5 && sessionIndex === 0)
      return "border-[1px] border-dark/50 border-b-0 border-l-0";
    if (dayIndex === 5 && sessionIndex === 3)
      return "border-[1px] border-dark/50 border-b-0 border-r-0";
    if (dayIndex === 0) return "border-[1px] border-dark/50 border-t-0";
    if (sessionIndex === 0) return "border-[1px] border-dark/50 border-l-0";
    if (sessionIndex === 3) return "border-[1px] border-dark/50 border-r-0";
    if (dayIndex === 5) return "border-[1px] border-dark/50 border-b-0";
    return "border-[1px] border-dark/50";
  };
  return (
    <div
      onClick={(e) => setSelectedCell([scheduleIndex, dayIndex, sessionIndex])}
      style={{
        maxWidth: `${ZOOM[view.zoom].maxW}rem`,
        minWidth: `${ZOOM[view.zoom].minW}rem`,
        height: `${ZOOM[view.zoom].h}rem`,
      }}
      className={`${getBorder()} ${isComplete()} relative box-border flex w-full cursor-pointer flex-col justify-between overflow-hidden p-2 text-start`}
    >
      <span
        style={{ fontSize: `${ZOOM[view.zoom].fontSize}rem` }}
        className="font-semibold"
      >
        {session[0]}
      </span>
      <span className="">
        <span>{session[1] + " "}</span>
        <span className="font-semibold text-primary">{session[3]}</span>
      </span>
      {session[2] && (
        <span
          style={{ fontSize: `${ZOOM[view.zoom].fontSize}rem` }}
          className="text-right font-semibold"
        >
          {session[2]}
        </span>
      )}
    </div>
  );
};

export default Cell;

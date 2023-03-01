import React from "react";
// Contexts.
import { useEditorContext } from "../../../Contexts/EditorContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { ZOOM } from "../../../helpers/constants";
// Helpers.
import { TEMPLATES } from "../../../helpers/templates";
// Components.
import Cell from "./Cell";

const Table = () => {
  const { data, docInfo } = useGlobalContext();
  const { currSchedule, view, setView } = useEditorContext();

  if (data.length === 0) return null;
  if (!data[currSchedule].group) return <div>please select a group first!</div>;

  const handleZoomSlider = (e: any) => {
    setView((x: any) => ({ ...x, zoom: parseInt(e.target.value) }));
    console.log(view);
  };

  return (
    <div
      style={{ fontSize: `${ZOOM[view.zoom].fontSize}rem` }}
      className="relative h-[calc(100vh-3rem)] w-full overflow-scroll p-2"
    >
      {/* Head */}
      <div className={`${view.sessions ? "flex" : "hidden"} mb-2`}>
        <div
          style={{ minWidth: `${ZOOM[view.zoom].minW}rem` }}
          className=""
        ></div>
        {TEMPLATES[docInfo.template].labels.sessions.map((value: string) => (
          <div
            key={value}
            style={{
              minWidth: `${ZOOM[view.zoom].minW}rem`,
              maxWidth: `${ZOOM[view.zoom].maxW}rem`,
            }}
            className="w-full text-center font-semibold"
          >
            {value}
          </div>
        ))}
      </div>
      {/* Body */}
      <div className="flex">
        <div
          style={{ minWidth: `${ZOOM[view.zoom].h}rem` }}
          className={view.days ? "" : "hidden"}
        >
          {TEMPLATES[docInfo.template].labels.days.map((value: string) => (
            <div
              key={value}
              style={{ height: `${ZOOM[view.zoom].h}rem` }}
              className="flex items-center justify-between font-semibold"
            >
              {value}
            </div>
          ))}
        </div>
        <div
          style={{
            maxWidth: `${
              parseInt(ZOOM[view.zoom].maxW) *
              TEMPLATES[docInfo.template].labels.sessions.length
            }rem`,
          }}
          className="w-full border-[1px] border-dark/50"
        >
          {data[currSchedule].schedule.map(
            (day: string[][], dayIndex: number) => (
              <div key={`day:${dayIndex}`} className="flex w-full">
                {day.map((session, sessionIndex) => (
                  <Cell
                    {...{
                      session,
                      scheduleIndex: currSchedule,
                      dayIndex,
                      sessionIndex,
                      view,
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Zoom */}
      <div className="absolute bottom-2 left-2 text-base">
        <div>{Math.fround(parseFloat(ZOOM[view.zoom].fontSize) * 100)}%</div>
        <input
          type="range"
          min="0"
          max={ZOOM.length - 1}
          step="1"
          value={view.zoom}
          onChange={handleZoomSlider}
        />
      </div>
    </div>
  );
};

export default Table;

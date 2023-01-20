import React from "react";
import { useGlobalContext } from "../../../../Contexts/GlobalContext";
import { DAYS_TEXT, SESSIONS_TEXT } from "../../../../constants";
import Cell from "./Cell";
import { useEditorContext } from "../../../../Contexts/EditorContext";

const Table = ({ schedualIndex }) => {
    const { setSelectedCell } = useEditorContext();
    const { data } = useGlobalContext();

    if (!data[schedualIndex].group) return "please select a group first!";

    return (
        <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl border-2 border-dark/50 shadow-lg">
            <div id={`doc_${schedualIndex}`} className="w-full">
                <div className="w-full">
                    <div className="grid w-full grid-cols-9">
                        <div className="grid font-semibold place-items-center">
                            <span className="grid w-8 h-8 text-lg font-bold rounded-full place-items-center bg-primary text-light">
                                {schedualIndex + 1}
                            </span>
                            <span className="leading-4 text-center">
                                {data[schedualIndex].faculty}
                            </span>
                        </div>
                        <div className="grid col-span-2 py-6 font-semibold text-white place-items-center bg-primary">
                            {SESSIONS_TEXT[0]}
                        </div>
                        <div className="grid col-span-2 py-6 font-semibold text-white place-items-center bg-primary">
                            {SESSIONS_TEXT[1]}
                        </div>
                        <div className="grid col-span-2 py-6 font-semibold text-white place-items-center bg-primary">
                            {SESSIONS_TEXT[2]}
                        </div>
                        <div className="grid col-span-2 py-6 font-semibold text-white place-items-center bg-primary">
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
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 col-span-8">
                            {data[schedualIndex].schedual.map(
                                (day, dayIndex) => {
                                    const group = data[schedualIndex].group;
                                    const faculty = group.slice(
                                        0,
                                        group.length - 4
                                    );
                                    return day.map((session, sessionIndex) => (
                                        <Cell
                                            key={`${group}${faculty}${dayIndex}${sessionIndex}`}
                                            {...{
                                                session,
                                                schedualIndex,
                                                dayIndex,
                                                sessionIndex,
                                                setSelectedCell,
                                            }}
                                        />
                                    ));
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;

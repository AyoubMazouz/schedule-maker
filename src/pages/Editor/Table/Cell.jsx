import React from "react";
import { useEditorContext } from "../../../Contexts/EditorContext";

const Cell = ({ session, schedualIndex, dayIndex, sessionIndex }) => {
    const { setSelectedCell, selectedCell, fusionMode } = useEditorContext();

    const isComplete = () => {
        if (session[0].trim() && session[1].trim() && session[2].trim())
            return "bg-dark/10";
        else if (session[0].trim() || session[1].trim() || session[2].trim())
            return "bg-secondary";
        return "";
    };

    const getBorder = () => {
        if (selectedCell) {
            const [x, y, z] = selectedCell;
            if (schedualIndex === x && dayIndex === y) {
                if (sessionIndex === z) {
                    if (fusionMode) {
                        if (sessionIndex % 2 === 0) {
                            return "border-2 border-r-0 border-emerald-500";
                        }
                        return "border-2 border-l-0 border-emerald-500";
                    }
                    return "border-2 border-emerald-500";
                } else if (sessionIndex % 2 !== 0 && sessionIndex - 1 === z) {
                    return "border-2 border-l-0 border-emerald-500";
                } else if (sessionIndex % 2 === 0 && sessionIndex + 1 === z) {
                    return "border-2 border-r-0 border-emerald-500";
                }
            }
        }

        if (dayIndex === 0 && sessionIndex === 0)
            return "border-[1px] border-t-0 border-l-0";
        if (dayIndex === 0 && sessionIndex === 3)
            return "border-[1px] border-t-0 border-r-0";
        if (dayIndex === 5 && sessionIndex === 0)
            return "border-[1px] border-b-0 border-l-0";
        if (dayIndex === 5 && sessionIndex === 3)
            return "border-[1px] border-b-0 border-r-0";
        if (dayIndex === 0) return "border-[1px] border-t-0";
        if (sessionIndex === 0) return "border-[1px] border-l-0";
        if (sessionIndex === 3) return "border-[1px] border-r-0";
        if (dayIndex === 5) return "border-[1px] border-b-0";
        return "border-[1px]";
    };

    return (
        <div
            onClick={(e) =>
                setSelectedCell([schedualIndex, dayIndex, sessionIndex])
            }
            className={`${getBorder()} ${isComplete()} relative  box-border h-[5.5rem] cursor-pointer overflow-hidden border-dark/50 px-2 text-start`}
        >
            <div className="text-lg font-semibold">{session[0]}</div>
            <div className="text-primary">{session[1]}</div>
            {session[2] && (
                <div className="text-lg">
                    {session[2].trim() && session[2] !== "TEAMS" && "Salle: "}
                    {session[2]}
                </div>
            )}
            <div className="absolute top-[0%] right-[0%]">{session[3]}</div>
        </div>
    );
};

export default Cell;
import React from "react";
import { useGlobalContext } from "../../../../Contexts/GlobalContext";
import useSettings from "../../../../hooks/useSettings";
import useEditor from "../../../../hooks/useEditor";

const Cell = ({
    session,
    schedualIndex,
    dayIndex,
    sessionIndex,
    setSelectedCell,
}) => {
    const isComplete = (session) => {
        if (session[0].trim() && session[1].trim() && session[2].trim())
            return "all";
        else if (session[0].trim() || session[1].trim() || session[2].trim())
            return "some";
    };

    const getBorder = () => {
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
            className={`${getBorder()} ${
                isComplete(session) && "bg-dark/10"
            } relative  box-border h-[5.5rem] cursor-pointer overflow-hidden border-dark/50 px-2 text-start`}
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

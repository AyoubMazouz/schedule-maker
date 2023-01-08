import React from "react";
import { DAYS_TEXT, SESSIONS_TEXT } from "../../../constants";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import useEditor from "../useEditor";

const Table = ({ schedualIndex }) => {
    const { data, setData, setAlert, saved, setSaved } = useGlobalContext();
    const { editField } = useEditor();
    const { getAllLabels } = useSettings();

    const [labels, setLabels] = React.useState({
        groups: [],
        profNames: [],
        rooms: [],
    });

    React.useEffect(() => {
        getAllLabels().then((labels) => setLabels(labels));
    }, [data]);

    const editFieldHandler = (dayIndex, sessionIndex, row, value) => {
        editField(
            data,
            setData,
            setAlert,
            schedualIndex,
            dayIndex,
            sessionIndex,
            row,
            value
        );
        setSaved(false);
    };

    return (
        <div className="flex justify-center">
            <div
                id={`doc_${schedualIndex}`}
                className="flex flex-col items-center max-w-[1400px] w-full"
            >
                <div className="max-w-[800px] rounded-xl border-2 border-dark/25 m-2 overflow-hidden">
                    <div className="grid grid-cols-9">
                        <div className="flex items-center flex-col font-semibold py-3">
                            <div className="text-lg font-bold h-8 w-8 bg-primary rounded-full text-light flex justify-center items-center">
                                {schedualIndex + 1}
                            </div>
                            <div className="text-center">
                                {data[schedualIndex].group}
                            </div>
                        </div>
                        <div className="grid place-items-center bg-primary font-semibold text-white py-5 col-span-2 border-2 border-dark/25">
                            {SESSIONS_TEXT[0]}
                        </div>
                        <div className="grid place-items-center bg-primary font-semibold text-white py-5 col-span-2 border-2 border-dark/25">
                            {SESSIONS_TEXT[1]}
                        </div>
                        <div className="grid place-items-center bg-primary font-semibold text-white py-5 col-span-2 border-2 border-dark/25">
                            {SESSIONS_TEXT[2]}
                        </div>
                        <div className="grid place-items-center bg-primary font-semibold text-white py-5 col-span-2 border-2 border-dark/25">
                            {SESSIONS_TEXT[3]}
                        </div>
                    </div>
                    {data[schedualIndex].schedual.map((day, dayIndex) => {
                        return (
                            <div className="grid grid-cols-9 border-b-2 h-[5.25rem] overflow-hidden">
                                <div className="flex justify-between pl-4 pr-1 bg-primary text-light border-2 border-dark/25">
                                    <div
                                        style={{
                                            writingMode: "vertical-rl",
                                        }}
                                        className="font-semibold text-center"
                                    >
                                        {DAYS_TEXT[dayIndex]}
                                    </div>
                                    <div className="font-semibold text-sm flex-col justify-between text-right py-2 hidden lg:flex">
                                        <div>Prof</div>
                                        <div>Mod</div>
                                        <div>Room</div>
                                    </div>
                                </div>
                                {day.map((session, sessionIndex) => {
                                    let done = "";

                                    if (
                                        session[0].trim() &&
                                        session[1].trim() &&
                                        session[2].trim()
                                    )
                                        done = "all";
                                    else if (
                                        session[0].trim() ||
                                        session[1].trim() ||
                                        session[2].trim()
                                    )
                                        done = "some";
                                    return (
                                        <div
                                            className={`
                                                col-span-2 border-2  
                                                ${
                                                    done === "all"
                                                        ? "bg-secondary border-dark/25"
                                                        : done === "some"
                                                        ? "border-rose-600"
                                                        : "opacity-50"
                                                }`}
                                        >
                                            <div>
                                                <select
                                                    name="group"
                                                    className="input w-full ring-0 h-[1.75rem] bg-transparent"
                                                    value={session[0]}
                                                    onChange={(e) =>
                                                        editFieldHandler(
                                                            dayIndex,
                                                            sessionIndex,
                                                            0,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Prof...
                                                    </option>

                                                    {labels.profNames.map(
                                                        (profName) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        profName
                                                                    }
                                                                >
                                                                    {profName}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Module..."
                                                    className="input w-full ring-0 h-[1.75rem] bg-transparent uppercase"
                                                    value={session[1]}
                                                    onChange={(e) =>
                                                        editFieldHandler(
                                                            dayIndex,
                                                            sessionIndex,
                                                            1,
                                                            e.target.value.toUpperCase()
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    name="room"
                                                    className="input w-full ring-0 h-[1.75rem] bg-transparent"
                                                    value={session[2]}
                                                    onChange={(e) =>
                                                        editFieldHandler(
                                                            dayIndex,
                                                            sessionIndex,
                                                            2,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Room...
                                                    </option>

                                                    {labels.rooms.map(
                                                        (room) => {
                                                            return (
                                                                <option
                                                                    value={room}
                                                                >
                                                                    {room}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Table;

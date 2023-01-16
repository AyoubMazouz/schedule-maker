import React from "react";
import { DAYS_TEXT, SESSIONS_TEXT } from "../../../constants";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import useEditor from "../useEditor";

const Table = ({ schedualIndex, setSaved }) => {
    const { data, setData, setAlert } = useGlobalContext();
    const { editField } = useEditor();
    const { getLabels } = useSettings();

    const [labels, setLabels] = React.useState({
        groups: [],
        profNames: [],
        rooms: [],
    });

    React.useEffect(() => {
        getLabels().then((labels) => setLabels(labels));
    }, [data]);

    const editFieldHandler = (dayIndex, sessionIndex, row, value) => {
        const res = editField(
            data,
            setData,
            setAlert,
            schedualIndex,
            dayIndex,
            sessionIndex,
            row,
            value
        );
        if (res) setSaved(false);
    };

    return (
        <div className="flex justify-center">
            <div
                id={`doc_${schedualIndex}`}
                className="flex w-full max-w-[1400px] flex-col items-center"
            >
                <div className="m-2 max-w-[800px] overflow-hidden rounded-xl border-2 border-dark/25">
                    <div className="grid grid-cols-9">
                        <div className="flex flex-col items-center py-3 font-semibold">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-light">
                                {schedualIndex + 1}
                            </div>
                            <div className="text-center">
                                {data[schedualIndex].group}
                            </div>
                        </div>
                        <div className="col-span-2 grid place-items-center border-2 border-dark/25 bg-primary py-5 font-semibold text-white">
                            {SESSIONS_TEXT[0]}
                        </div>
                        <div className="col-span-2 grid place-items-center border-2 border-dark/25 bg-primary py-5 font-semibold text-white">
                            {SESSIONS_TEXT[1]}
                        </div>
                        <div className="col-span-2 grid place-items-center border-2 border-dark/25 bg-primary py-5 font-semibold text-white">
                            {SESSIONS_TEXT[2]}
                        </div>
                        <div className="col-span-2 grid place-items-center border-2 border-dark/25 bg-primary py-5 font-semibold text-white">
                            {SESSIONS_TEXT[3]}
                        </div>
                    </div>
                    {data[schedualIndex].schedual.map((day, dayIndex) => {
                        return (
                            <div className="grid h-[5.25rem] grid-cols-9 overflow-hidden border-b-2">
                                <div className="flex justify-between border-2 border-dark/25 bg-primary pl-4 pr-1 text-light">
                                    <div
                                        style={{
                                            writingMode: "vertical-rl",
                                        }}
                                        className="text-center font-semibold"
                                    >
                                        {DAYS_TEXT[dayIndex]}
                                    </div>
                                    <div className="hidden flex-col justify-between py-2 text-right text-sm font-semibold lg:flex">
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
                                                        ? "border-dark/25 bg-secondary"
                                                        : done === "some"
                                                        ? "border-rose-600"
                                                        : "opacity-50"
                                                }`}
                                        >
                                            <div>
                                                <select
                                                    name="group"
                                                    className="input h-[1.75rem] w-full bg-transparent ring-0"
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
                                                    className="input h-[1.75rem] w-full bg-transparent uppercase ring-0"
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
                                                    className="input h-[1.75rem] w-full bg-transparent ring-0"
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

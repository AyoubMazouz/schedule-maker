import React from "react";
import {
    IcBin,
    IcDelete,
    IcEx,
    IcPlus,
    IcRemove,
    IcSave,
} from "../../components/icons";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";

const Labels = ({ saved, setSaved }) => {
    const { getLabels, setLabels } = useSettings();

    const { setAlert } = useGlobalContext();

    const [data, setData] = React.useState({
        groups: [],
        profNames: [],
        rooms: [],
    });
    const [profInput, setProfInput] = React.useState("");
    const [roomInput, setRoomInput] = React.useState("");
    const [groupInput, setGroupInput] = React.useState("");

    React.useEffect(() => {
        getLabels().then((data) => {
            setData(data);
        });
    }, []);

    React.useEffect(() => {
        if (saved) window.onbeforeunload = null;
        else
            window.onbeforeunload = () => {
                const message =
                    "You can't leave this page with unsaved changes, if you leave changes will be lost.";
                setAlert({
                    type: "warn",
                    message,
                });
                return message;
            };
    }, [saved]);

    const addGroup = async () => {
        const labelsDoc = {
            profNames: data.profNames,
            rooms: data.rooms,
            groups: [...data.groups, groupInput],
        };
        setGroupInput("");
        setData(labelsDoc);
        setSaved(false);
    };
    const addProf = async () => {
        const labelsDoc = {
            rooms: data.rooms,
            groups: data.groups,
            profNames: [...data.profNames, profInput],
        };
        setProfInput("");
        setData(labelsDoc);
        setSaved(false);
    };
    const addRoom = async () => {
        const labelsDoc = {
            profNames: data.profNames,
            groups: data.groups,
            rooms: [...data.rooms, roomInput],
        };
        setRoomInput("");
        setData(labelsDoc);
        setSaved(false);
    };

    const deleteProf = async (profName) => {
        const profNames = data.profNames.filter(
            (currProf) => currProf !== profName
        );
        const labelsDoc = {
            groups: data.groups,
            rooms: data.rooms,
            profNames,
        };
        setData(labelsDoc);
        setSaved(false);
    };
    const deleteGroup = async (group) => {
        const groups = data.groups.filter((currGroup) => currGroup !== group);
        const labelsDoc = {
            profNames: data.profNames,
            rooms: data.rooms,
            groups,
        };
        setData(labelsDoc);
        setSaved(false);
    };
    const deleteRoom = async (room) => {
        const rooms = data.rooms.filter((currRoom) => currRoom !== room);
        const labelsDoc = {
            profNames: data.profNames,
            groups: data.groups,
            rooms,
        };
        setData(labelsDoc);
        setSaved(false);
    };

    const saveHandler = () => {
        setLabels(data);
        setSaved(true);
    };

    const discardChanges = () => {
        getLabels().then((data) => {
            setData(data);
        });
        setSaved(true);
    };

    const enterKeyPressHandler = (e) => {
        if (e.key !== "Enter") return;

        if (e.target.id === "prof") addProf();
        else if (e.target.id === "room") addRoom();
        else if (e.target.id === "group") addGroup();
    };

    return (
        <div>
            <div className="m-2 flex justify-end gap-x-6 rounded-lg border p-2 shadow-md">
                <button
                    disabled={saved}
                    className="btn-success"
                    onClick={saveHandler}
                >
                    <IcSave className="icon" />
                    <span>save</span>
                </button>
                <button
                    disabled={saved}
                    className="btn-secondary"
                    onClick={discardChanges}
                >
                    <IcBin className="icon" />
                    <span>discard</span>
                </button>
            </div>
            <div className="mt-4 space-y-4 px-2">
                {/* Prof */}
                <div className="space-y-3">
                    <div className="text-xl font-semibold">ProfNames:</div>
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
                        {data &&
                            data.profNames.map((profName) => (
                                <div className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 py-0.5 pl-3 pr-2  font-semibold text-dark">
                                    <div>{profName}</div>
                                    <button
                                        onClick={() => deleteProf(profName)}
                                    >
                                        <IcEx className="transition-all duration-300 hover:scale-125 hover:text-primary" />
                                    </button>
                                </div>
                            ))}
                        <input
                            type="text"
                            id="prof"
                            placeholder="type here..."
                            value={profInput}
                            onChange={(e) => setProfInput(e.target.value)}
                            onKeyPress={enterKeyPressHandler}
                            className="h-[1.9rem] max-w-[8rem] rounded-full bg-light px-2 capitalize ring-primary focus:outline-none focus:ring-2"
                        />
                    </div>
                </div>
                {/* Rooms */}
                <div className="space-y-3">
                    <div className="text-xl font-semibold">Rooms:</div>
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
                        {data &&
                            data.rooms.map((room) => (
                                <div className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 p-1 pl-3 font-semibold text-dark">
                                    <div>{room}</div>
                                    <button onClick={() => deleteRoom(room)}>
                                        <IcEx className="transition-all duration-300 hover:scale-125 hover:text-primary" />
                                    </button>
                                </div>
                            ))}
                        <input
                            type="text"
                            id="room"
                            placeholder="type here..."
                            value={roomInput}
                            onChange={(e) => setRoomInput(e.target.value)}
                            onKeyPress={enterKeyPressHandler}
                            className="h-[1.9rem] max-w-[8rem] rounded-full bg-light px-2 capitalize ring-primary focus:outline-none focus:ring-2"
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="text-xl font-semibold">Groups:</div>
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
                        {data &&
                            data.groups.map((group) => (
                                <div className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 p-1 pl-3 font-semibold text-dark">
                                    <div>{group}</div>
                                    <button onClick={() => deleteGroup(group)}>
                                        <IcEx className="transition-all duration-300 hover:scale-125 hover:text-primary" />
                                    </button>
                                </div>
                            ))}
                        <input
                            type="text"
                            id="group"
                            placeholder="type here..."
                            value={groupInput}
                            onChange={(e) => setGroupInput(e.target.value)}
                            onKeyPress={enterKeyPressHandler}
                            className="h-[1.9rem] max-w-[8rem] rounded-full bg-light px-2 capitalize ring-primary focus:outline-none focus:ring-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Labels;

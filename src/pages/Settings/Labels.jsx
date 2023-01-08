import React from "react";
import { IcDelete, IcPlus } from "../../components/icons";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";

const Labels = () => {
    const {
        getAllLabels,
        addNewProf,
        addNewRoom,
        addNewGroup,
        deleteRoom,
        deleteProf,
        deleteGroup,
    } = useSettings();

    const { setAlert } = useGlobalContext();

    const [labels, setLabels] = React.useState({
        groups: [],
        profNames: [],
        rooms: [],
    });
    const [prof, setProf] = React.useState("");
    const [room, setRoom] = React.useState("");
    const [group, setGroup] = React.useState("");

    React.useEffect(() => {
        getAllLabels().then((data) => {
            setLabels(data);
        });
    }, []);

    const update = () => getAllLabels().then((data) => setLabels(data));

    const addGroupHandler = async () => {
        await addNewGroup(group);
        update();
        setGroup("");
        setAlert({
            type: "success",
            message: `Group "${group}" has been added.`,
        });
    };
    const addProfHandler = async () => {
        const profStr = prof.charAt(0).toUpperCase() + prof.slice(1);
        await addNewProf(profStr);
        update();
        setProf("");
        setAlert({
            type: "success",
            message: `Prof "${profStr}" has been added.`,
        });
    };
    const addRoomHandler = async () => {
        await addNewRoom(room);
        update();
        setRoom("");
        setAlert({
            type: "success",
            message: `"${
                room.toLowerCase() === "teams"
                    ? room
                    : "The room number " + room
            }" has been added.`,
        });
    };

    const deleteProfHandler = async (prof) => {
        await deleteProf(prof);
        update();
        setAlert({
            type: "warn",
            message: `Prof "${prof}" has been removed...`,
        });
    };
    const deleteGroupHandler = async (group) => {
        await deleteGroup(group);
        update();
        setAlert({
            type: "warn",
            message: `The group "${group}" has been delete...`,
        });
    };
    const deleteRoomHandler = async (room) => {
        await deleteRoom(room);
        update();
        setAlert({
            type: "warn",
            message: `"${
                room.toLowerCase() === "teams"
                    ? room
                    : "The room number " + room
            }" has been delete...`,
        });
    };
    return (
        <div className="space-y-8 p-2">
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <div className="text-xl font-semibold">ProfNames</div>

                    <input
                        type="text"
                        className="input capitalize"
                        value={prof}
                        onChange={(e) => setProf(e.target.value)}
                    />
                    <button className="btn-success" onClick={addProfHandler}>
                        <IcPlus className="icon" />
                        <span>Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {labels &&
                        labels.profNames.map((profName) => (
                            <div className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 p-1 pl-3 font-semibold text-dark">
                                <div>{profName}</div>
                                <button
                                    className="btn-danger rounded-full p-1"
                                    onClick={() => deleteProfHandler(profName)}
                                >
                                    <IcDelete className="icon" />
                                </button>
                            </div>
                        ))}
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <div className="text-xl font-semibold">Rooms:</div>

                    <input
                        type="text"
                        className="input"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button className="btn-success" onClick={addRoomHandler}>
                        <IcPlus className="icon" />
                        <span>Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {labels &&
                        labels.rooms.map((room) => (
                            <div className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 p-1 pl-3 font-semibold text-dark">
                                <div>{room}</div>
                                <button
                                    className="btn-danger rounded-full p-1"
                                    onClick={() => deleteRoomHandler(room)}
                                >
                                    <IcDelete className="icon" />
                                </button>
                            </div>
                        ))}
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <div className="text-xl font-semibold">Groups:</div>
                    <input
                        type="text"
                        className="input"
                        value={group}
                        onChange={(e) => setGroup(e.target.value.toUpperCase())}
                    />
                    <button className="btn-success" onClick={addGroupHandler}>
                        <IcPlus className="icon" />
                        <span>Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {labels &&
                        labels.groups.map((group) => (
                            <div className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 p-1 pl-3 font-semibold text-dark">
                                <div>{group}</div>
                                <button
                                    className="btn-danger rounded-full p-1"
                                    onClick={() => deleteGroupHandler(group)}
                                >
                                    <IcDelete className="icon" />
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Labels;

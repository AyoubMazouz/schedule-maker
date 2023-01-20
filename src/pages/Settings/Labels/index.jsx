import React from "react";
import { IcBin, IcDoc, IcEdit, IcMore } from "../../../components/icons";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import OptionBar from "./OptionBar";

const Labels = ({ saved, setSaved }) => {
    const { getLabels, deleteRoom, deleteFaculty, deleteTrainer, deleteEvent } =
        useSettings();

    const { setAlert, setModel } = useGlobalContext();

    const [data, setData] = React.useState({
        trainers: [],
        rooms: [],
        faculties: [],
        events: [],
    });

    const menuRef = React.useRef(null);
    const [currMenu, setCurrMenu] = React.useState(null);
    React.useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setCurrMenu(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    React.useEffect(() => {
        getLabels().then((labels) => setData(labels));
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

    const showDetails = (labelType, v) => {
        let details = [];
        if (labelType === "factory")
            details = [
                ["id", v.id],
                ["faculty", v.name],
                ["number of first year groups", v.firstYear],
                ["number of second year groups", v.secondYear],
                ["created at", v.createdAt.toDate().toDateString()],
                ["modified at", v.modifiedAt.toDate().toDateString()],
                ["modules", v.modules.join(", ")],
            ];
        else if (labelType === "trainer")
            details = [
                ["id", v.id],
                ["trainer name", v.name],
                ["created at", v.createdAt.toDate().toDateString()],
                ["modified at", v.modifiedAt.toDate().toDateString()],
                ["prefered rooms", v.preferedRooms.join(", ")],
            ];
        else if (labelType === "room")
            details = [
                ["id", v.id],
                ["room", v.name],
                ["created at", v.createdAt.toDate().toDateString()],
                ["modified at", v.modifiedAt.toDate().toDateString()],
            ];
        else if (labelType === "event")
            details = [
                ["id", v.id],
                ["event", v.name],
                ["created at", v.createdAt.toDate().toDateString()],
                ["modified at", v.modifiedAt.toDate().toDateString()],
            ];
        if (details.length) setModel({ type: "showDetails", details });
    };

    return (
        <div className="p-2 space-y-2">
            <OptionBar
                {...{
                    menuRef,
                    currMenu,
                    setCurrMenu,
                    saved,
                    setSaved,
                    data,
                    setData,
                }}
            />
            <div>Faculties:</div>
            <div className="border-2 rounded-lg shadow-lg border-dark/25">
                {data.faculties.map((faculty, facultyIndex) => (
                    <div
                        key={faculty}
                        className={`menu-item group flex justify-between text-center ${
                            facultyIndex % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <button
                            onClick={(e) => showDetails("factory", faculty)}
                            className="grid w-full grid-cols-12"
                        >
                            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
                                <IcDoc className="inline-block icon" />
                                <span>{faculty.name}</span>
                            </div>
                            <div className="hidden col-span-3 md:block">
                                {faculty.createdAt.toDate().toDateString()}
                            </div>
                        </button>
                        <div className="relative flex gap-x-2 text-end">
                            <button onClick={(e) => setCurrMenu(faculty.name)}>
                                <IcMore
                                    className={
                                        currMenu === faculty.name
                                            ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                            : "text-xl"
                                    }
                                />
                            </button>
                            {currMenu === faculty.name && (
                                <div
                                    ref={menuRef}
                                    className="menu top-[0%] left-[0%] translate-x-[-100%]"
                                >
                                    <button
                                        className="menu-item"
                                        onClick={() => ""}
                                    >
                                        <IcEdit className="icon" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => {
                                            deleteFaculty(
                                                data,
                                                setData,
                                                faculty.id
                                            );
                                            setSaved(false);
                                        }}
                                    >
                                        <IcBin className="icon" />
                                        <span>delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div>Trainers:</div>
            <div className="border-2 rounded-lg shadow-lg border-dark/25">
                {data.trainers.map((trainer, trainerIndex) => (
                    <div
                        key={trainer}
                        className={`menu-item group flex justify-between text-center ${
                            trainerIndex % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <button
                            onClick={(e) => showDetails("trainer", trainer)}
                            className="grid w-full grid-cols-12"
                        >
                            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
                                <IcDoc className="inline-block icon" />
                                <span>{trainer.name}</span>
                            </div>
                            <div className="hidden col-span-3 md:block">
                                {trainer.createdAt.toDate().toDateString()}
                            </div>
                        </button>
                        <div className="relative flex gap-x-2 text-end">
                            <button onClick={(e) => setCurrMenu(trainer.name)}>
                                <IcMore
                                    className={
                                        currMenu === trainer.name
                                            ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                            : "text-xl"
                                    }
                                />
                            </button>
                            {currMenu === trainer.name && (
                                <div
                                    ref={menuRef}
                                    className="menu top-[0%] left-[0%] translate-x-[-100%]"
                                >
                                    <button
                                        className="menu-item"
                                        onClick={() => ""}
                                    >
                                        <IcEdit className="icon" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => {
                                            deleteTrainer(
                                                data,
                                                setData,
                                                trainer.id
                                            );
                                            setSaved(false);
                                        }}
                                    >
                                        <IcBin className="icon" />
                                        <span>delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div>Rooms:</div>
            <div className="border-2 rounded-lg shadow-lg border-dark/25">
                {data.rooms.map((room, roomIndex) => (
                    <div
                        key={room}
                        className={`menu-item group flex justify-between text-center ${
                            roomIndex % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <button
                            onClick={(e) => showDetails("room", room)}
                            className="grid w-full grid-cols-12"
                        >
                            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
                                <IcDoc className="inline-block icon" />
                                <span>{room.name}</span>
                            </div>
                            <div className="hidden col-span-3 md:block">
                                {room.createdAt.toDate().toDateString()}
                            </div>
                        </button>
                        <div className="relative flex gap-x-2 text-end">
                            <button
                                onClick={(e) =>
                                    setCurrMenu(`roomId:${room.name}`)
                                }
                            >
                                <IcMore
                                    className={
                                        currMenu === room.name
                                            ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                            : "text-xl"
                                    }
                                />
                            </button>
                            {currMenu === `roomId:${room.name}` && (
                                <div
                                    ref={menuRef}
                                    className="menu top-[0%] left-[0%] translate-x-[-100%]"
                                >
                                    <button
                                        className="menu-item"
                                        onClick={() => ""}
                                    >
                                        <IcEdit className="icon" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => {
                                            deleteRoom(data, setData, room.id);
                                            setSaved(false);
                                        }}
                                    >
                                        <IcBin className="icon" />
                                        <span>delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div>Events:</div>
            <div className="border-2 rounded-lg shadow-lg border-dark/25">
                {data.events.map((event, eventIndex) => (
                    <div
                        key={event}
                        className={`menu-item group flex justify-between text-center ${
                            eventIndex % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <button
                            onClick={(e) => showDetails("event", event)}
                            className="grid w-full grid-cols-12"
                        >
                            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
                                <IcDoc className="inline-block icon" />
                                <span>{event.name}</span>
                            </div>
                            <div className="hidden col-span-3 md:block">
                                {event.createdAt.toDate().toDateString()}
                            </div>
                        </button>
                        <div className="relative flex gap-x-2 text-end">
                            <button
                                onClick={(e) =>
                                    setCurrMenu(`eventId:${event.name}`)
                                }
                            >
                                <IcMore
                                    className={
                                        currMenu === event.name
                                            ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                            : "text-xl"
                                    }
                                />
                            </button>
                            {currMenu === `eventId:${event.name}` && (
                                <div
                                    ref={menuRef}
                                    className="menu top-[0%] left-[0%] translate-x-[-100%]"
                                >
                                    <button
                                        className="menu-item"
                                        onClick={() => ""}
                                    >
                                        <IcEdit className="icon" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => {
                                            deleteEvent(
                                                data,
                                                setData,
                                                event.id
                                            );
                                            setSaved(false);
                                        }}
                                    >
                                        <IcBin className="icon" />
                                        <span>delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Labels;

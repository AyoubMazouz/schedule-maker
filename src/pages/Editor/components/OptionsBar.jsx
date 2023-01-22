import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useEditor from "../../../hooks/useEditor";
import useSettings from "../../../hooks/useSettings";
import {
    IcBin,
    IcDown,
    IcExport,
    IcFusion,
    IcImport,
    IcLogout,
    IcNewDoc,
    IcSave,
} from "../../../components/icons";
import { useEditorContext } from "../../../Contexts/EditorContext";

const OptionBar = () => {
    const { saved, setSaved, setFusionMode, fusionMode, selectedCell } =
        useEditorContext();
    const { data, setData, loadData, setModel, setAlert, setName } =
        useGlobalContext();
    const {
        addNewDocument,
        importDocument,
        exportDocument,
        downloadAsPdf,
        clearCell,
    } = useEditor();

    const { nameid } = useParams();
    const navigate = useNavigate();
    const { getLabels } = useSettings();
    const { editField } = useEditor();

    const menuRef = React.useRef(null);
    const [currMenu, setCurrMenu] = React.useState(null);
    const [newDocName, setNewDocName] = React.useState(nameid);
    const [labelsData, setLabelsData] = React.useState({
        faculties: [],
        trainers: [],
        rooms: [],
        events: [],
    });
    const [modules, setModules] = React.useState([]);

    React.useEffect(() => {
        getLabels().then((labels) => {
            setLabelsData(labels);
        });
    }, []);

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
        setNewDocName(nameid);
        setName(nameid);
        loadData(nameid);
    }, [nameid]);

    React.useEffect(() => {
        if (selectedCell) {
            const l = data[selectedCell[0]].group.length;
            const faculty = data[selectedCell[0]].group.slice(0, l - 4);
            const year = data[selectedCell[0]].group.slice(l - 3, l - 2);
            const facultiesLS = labelsData.faculties.filter(
                (f) => f.name === faculty
            );
            if (facultiesLS.length) {
                if (year === "1") {
                    setModules(facultiesLS[0].firstYearModules);
                } else {
                    setModules(facultiesLS[0].secondYearModules);
                }
            } else {
                setModules([]);
            }
        }
    }, [selectedCell, data]);

    const saveHandler = async () => {
        setCurrMenu(null);
        await addNewDocument(data, newDocName);
        setSaved(true);
    };

    const exitHandler = async () => {
        if (saved) navigate("/documents");
        else
            setModel({
                type: "exit",
            });

        setCurrMenu(null);
    };

    const downloadHandler = () => {
        downloadAsPdf(data, nameid);
        setAlert({ type: "success", message: "Download has started..." });
        setCurrMenu(null);
    };

    const exportHandler = () => {
        exportDocument(data, newDocName);
        setCurrMenu(null);
    };
    const newDocHandler = (e) => {
        setModel({
            type: "newdoc",
        });
    };

    const clearCellHandler = () => {
        const [schedualIndex, dayIndex, sessionIndex] = selectedCell;
        const res = clearCell(
            data,
            setData,
            fusionMode,
            schedualIndex,
            dayIndex,
            sessionIndex
        );
        if (res) setSaved(false);
    };

    let schedualIndex, dayIndex, sessionIndex;
    if (selectedCell) [schedualIndex, dayIndex, sessionIndex] = selectedCell;

    const editFieldHandler = (row, value) => {
        const res = editField(
            data,
            setData,
            setAlert,
            schedualIndex,
            dayIndex,
            sessionIndex,
            row,
            value,
            fusionMode
        );
        if (res) setSaved(false);
    };

    const getOffset = () => {
        if (!fusionMode) return 0;
        const z = parseInt(selectedCell.charAt(2));
        if (z === sessionIndex) return 0;
        return z % 2 === 0 ? -1 : 1;
    };

    const isComplete = (session) => {
        if (session[0].trim() && session[1].trim() && session[2].trim())
            return "all";
        else if (session[0].trim() || session[1].trim() || session[2].trim())
            return "some";
    };

    return (
        <div className="sticky top-0 z-30 flex items-center justify-between w-full p-2 gap-x-2">
            <button
                className={`btn-secondary relative ${
                    !saved &&
                    "after:absolute after:top-[0%] after:right-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
                }`}
                onClick={() => setCurrMenu("file")}
            >
                <IcDown className="text-xl" />
                <span>File</span>
            </button>
            {currMenu === "file" && (
                <div ref={menuRef} className="menu top-[96%] left-[1%]">
                    <button
                        disabled={saved}
                        className={`menu-item relative ${
                            !saved &&
                            "after:absolute after:top-[38%] after:left-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
                        }`}
                        onClick={saveHandler}
                    >
                        <IcSave className="icon" />
                        <span>Save</span>
                    </button>
                    <button className="menu-item " onClick={newDocHandler}>
                        <IcNewDoc className="icon" />
                        <span>New</span>
                    </button>
                    <div className="relative overflow-hidden menu-item">
                        <input
                            type="file"
                            accept=".json,.xls,.xlsm"
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                            onChange={(e) =>
                                importDocument(e.target.files[0], setData)
                            }
                        />
                        <IcImport className="icon" />
                        <span>Import</span>
                    </div>
                    <button className="menu-item" onClick={exportHandler}>
                        <IcExport className="icon" />
                        <span>Export as Json</span>
                    </button>
                    <button className="menu-item" onClick={downloadHandler}>
                        <IcExport className="icon" />
                        <span>Export as pdf</span>
                    </button>
                    <button
                        onClick={exitHandler}
                        className="border-b-0 menu-item"
                    >
                        <IcLogout className="icon" />
                        <span>Exit</span>
                    </button>
                </div>
            )}
            <div className="flex gap-x-2">
                <button
                    className={`flex h-8 w-8 items-center justify-center rounded transition-all duration-300 hover:bg-dark/25 ${
                        fusionMode ? "bg-primary/25" : ""
                    }`}
                    onClick={() => setFusionMode((x) => !x)}
                >
                    <IcFusion className="icon" />
                </button>
            </div>
            {selectedCell ? (
                <div className="flex items-center gap-x-2">
                    <button
                        className={`flex h-8 w-8 items-center justify-center rounded transition-all duration-300 hover:bg-dark/25`}
                        onClick={clearCellHandler}
                    >
                        <IcBin className="icon" />
                    </button>
                    <div>
                        <select
                            name="trainer"
                            className="input"
                            value={
                                data[schedualIndex].schedual[dayIndex][
                                    sessionIndex
                                ][0]
                            }
                            onChange={(e) =>
                                editFieldHandler(0, e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Trainer...
                            </option>
                            {labelsData.trainers.map((trainer) => {
                                return (
                                    <option value={trainer.name}>
                                        {trainer.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <select
                            name="module"
                            className="input"
                            value={
                                data[schedualIndex].schedual[dayIndex][
                                    sessionIndex
                                ][1]
                            }
                            onChange={(e) =>
                                editFieldHandler(1, e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Module...
                            </option>
                            {modules.map((mod) => (
                                <option value={mod}>{mod}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            name="room"
                            className="input"
                            value={
                                data[schedualIndex].schedual[dayIndex][
                                    sessionIndex
                                ][2]
                            }
                            onChange={(e) =>
                                editFieldHandler(2, e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Room...
                            </option>
                            {labelsData.rooms.map((room) => {
                                return (
                                    <option value={room.name}>
                                        {room.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <select
                            name="event"
                            className="input"
                            value={
                                data[schedualIndex].schedual[dayIndex][
                                    sessionIndex
                                ][3]
                            }
                            onChange={(e) =>
                                editFieldHandler(3, e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Event...
                            </option>
                            {labelsData.events.map((event) => {
                                return (
                                    <option value={event.name}>
                                        {event.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="text-xs leading-3">
                        <div>
                            <span>x:</span>
                            <span className="font-semibold text-primary">
                                {schedualIndex}
                            </span>
                        </div>
                        <div>
                            <span>y:</span>
                            <span className="font-semibold text-primary">
                                {dayIndex}
                            </span>
                        </div>
                        <div>
                            <span>z:</span>
                            <span className="font-semibold text-primary">
                                {sessionIndex}
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default OptionBar;

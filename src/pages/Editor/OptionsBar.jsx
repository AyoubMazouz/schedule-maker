import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useLabels from "../../hooks/useLabels";
import useEditor from "../../hooks/useEditor";
import {
    IcBin,
    IcExport,
    IcFusion,
    IcImport,
    IcLogout,
    IcNewDoc,
    IcSave,
} from "../../components/icons";
import { useEditorContext } from "../../Contexts/EditorContext";
import useDocument from "../../hooks/useDocument";
import { Select } from "../../components/Select";
import { DropdownMenu } from "../../components/DropdownMenu";
import { Button } from "../../components/Button";
import { usePdf } from "../../hooks/usePdf";

const OptionBar = () => {
    const { saved, setSaved, setFusionMode, fusionMode, selectedCell } =
        useEditorContext();
    const { data, setData, loadData, setModel, setAlert, setName } =
        useGlobalContext();
    const { importDocument, exportDocument, clearCell } = useEditor();
    const { addNewDocument } = useDocument();
    const { getLabels } = useLabels();
    const { editField } = useEditor();
    const { exportAsPdf } = usePdf();

    const { nameid } = useParams();
    const navigate = useNavigate();

    const menuRef = React.useRef(null);
    const [currMenu, setCurrMenu] = React.useState(null);
    const [labelsData, setLabelsData] = React.useState({
        levels: [],
        trainers: [],
        rooms: [],
        events: [],
    });
    const [modules, setModules] = React.useState([]);

    const [unavailableTrainers, setUnavailableTrainers] = React.useState([]);
    const [unavailableRooms, setUnavailableRooms] = React.useState([]);
    const [preferedRooms, setPreferedRooms] = React.useState([]);

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
        setName(nameid);
        loadData(nameid);
    }, [nameid]);

    React.useEffect(() => {
        if (selectedCell) {
            const [schedualIndex, dayIndex, sessionIndex] = selectedCell;
            const l = data[schedualIndex].group.length;
            const level = data[schedualIndex].group.slice(0, l - 2);
            const newLevels = labelsData.levels.filter((f) => f.name === level);
            if (newLevels.length) {
                setModules(newLevels[0].modules);
            } else {
                setModules([]);
            }

            // Check for unavailable trainers.
            const unAvailableTrainers = data.map((sch) => {
                const trainer = sch.schedual[dayIndex][sessionIndex][0];
                if (trainer) return trainer;
                return null;
            });
            setUnavailableTrainers(unAvailableTrainers);

            // Check for unavailable rooms.
            const unavailableRooms = data.map((sch) => {
                const room = sch.schedual[dayIndex][sessionIndex][2];
                if (room) return room;
                return null;
            });

            setUnavailableTrainers(unAvailableTrainers);
            setUnavailableRooms(unavailableRooms);

            const trainer =
                data[schedualIndex].schedual[dayIndex][sessionIndex][0];
            if (trainer) {
                const preferedRooms = labelsData.trainers.filter(
                    (v) => v.name === trainer
                )[0]?.preferedRooms;
                setPreferedRooms(preferedRooms || []);
            } else setPreferedRooms([]);
        }
    }, [selectedCell, data]);

    const saveHandler = async () => {
        setCurrMenu(null);
        await addNewDocument(data, nameid);
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
        exportAsPdf(data, nameid);
        setAlert({ type: "success", message: "Download has started..." });
        setCurrMenu(null);
    };

    const exportHandler = () => {
        exportDocument(data, nameid);
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

    const SaveMenuItem = () => (
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
    );
    const ImportMenuItem = () => (
        <div className="relative overflow-hidden menu-item">
            <input
                type="file"
                accept=".json,.xls,.xlsm"
                className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                onChange={(e) => importDocument(e.target.files[0], setData)}
            />
            <IcImport className="icon" />
            <span>Import</span>
        </div>
    );

    return (
        <div className="sticky top-0 z-30 flex items-center justify-between w-full p-2 gap-x-2">
            <DropdownMenu
                text="file"
                menuRef={menuRef}
                currMenu={currMenu}
                setCurrMenu={setCurrMenu}
                options={[
                    <SaveMenuItem />,
                    ["new", newDocHandler, IcNewDoc],
                    <ImportMenuItem />,
                    ["Export as Json", exportHandler, IcExport],
                    ["Export as pdf", downloadHandler, IcExport],
                    ["exit", exitHandler, IcLogout],
                ]}
            />
            <div className="flex gap-x-2">
                <Button
                    label={[
                        "Fusion Mode",
                        "Let's you fill two fields at once.",
                    ]}
                    Icon={IcFusion}
                    onClick={() => setFusionMode((x) => !x)}
                    trigger={fusionMode}
                />
            </div>
            {selectedCell ? (
                <div className="flex items-center gap-x-2">
                    <Button
                        Icon={IcBin}
                        label={["clear"]}
                        onClick={clearCellHandler}
                    />
                    <Select
                        label="trainers"
                        notRecommended={unavailableTrainers}
                        values={labelsData.trainers}
                        defaultValue={
                            data[schedualIndex].schedual[dayIndex][
                                sessionIndex
                            ][0]
                        }
                        onChange={(v) => editFieldHandler(0, v)}
                    />
                    <Select
                        label="modules"
                        values={modules}
                        defaultValue={
                            data[schedualIndex].schedual[dayIndex][
                                sessionIndex
                            ][1]
                        }
                        onChange={(v) => editFieldHandler(1, v)}
                    />
                    <Select
                        label="rooms"
                        recommended={preferedRooms}
                        notRecommended={unavailableRooms}
                        values={labelsData.rooms}
                        defaultValue={
                            data[schedualIndex].schedual[dayIndex][
                                sessionIndex
                            ][2]
                        }
                        onChange={(v) => editFieldHandler(2, v)}
                    />
                    <Select
                        label="events"
                        values={labelsData.events}
                        defaultValue={
                            data[schedualIndex].schedual[dayIndex][
                                sessionIndex
                            ][3]
                        }
                        onChange={(v) => editFieldHandler(3, v)}
                    />
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
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default OptionBar;

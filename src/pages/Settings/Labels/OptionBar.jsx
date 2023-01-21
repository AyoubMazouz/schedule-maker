import React from "react";
import {
    IcBin,
    IcDown,
    IcExport,
    IcImport,
    IcNewDoc,
    IcSave,
} from "../../../components/icons";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";

const OptionBar = ({
    menuRef,
    currMenu,
    setCurrMenu,
    saved,
    setSaved,
    labelsData,
    setLabelsData,
}) => {
    const { setModel } = useGlobalContext();
    const { getLabels, setLabels, importSettings, exportSettings } =
        useSettings();

    const saveHandler = () => {
        setLabels(labelsData);
        setSaved(true);
    };

    const discardChanges = () => {
        getLabels().then((data) => {
            setLabelsData(data);
        });
        setSaved(true);
    };

    const addFacultyHandler = () => {
        setModel({
            type: "addFaculty",
            labelsData,
            setLabelsData,
            setSaved,
        });
    };
    const addTrainerHandler = () => {
        setModel({
            type: "addTrainer",
            labelsData,
            setLabelsData,
            setSaved,
        });
    };
    const addRoomHandler = () => {
        setModel({
            type: "addRoom",
            labelsData,
            setLabelsData,
            setSaved,
        });
    };
    const addEventHandler = () => {
        setModel({
            type: "addEvent",
            labelsData,
            setLabelsData,
            setSaved,
        });
    };

    return (
        <div className="relative flex justify-between gap-6 p-2 border rounded-lg shadow-md">
            <button
                className={`btn-secondary`}
                onClick={() => setCurrMenu("add")}
            >
                <IcDown className="text-xl" />
                <span>Add</span>
            </button>
            {currMenu === "add" && (
                <div ref={menuRef} className="menu top-[96%] left-[1%]">
                    <button className="menu-item" onClick={addFacultyHandler}>
                        <IcNewDoc className="icon" />
                        <span>New Faculty</span>
                    </button>
                    <button className="menu-item" onClick={addTrainerHandler}>
                        <IcNewDoc className="icon" />
                        <span>New Trainer</span>
                    </button>
                    <button className="menu-item" onClick={addRoomHandler}>
                        <IcNewDoc className="icon" />
                        <span>New Room</span>
                    </button>
                    <button className="menu-item" onClick={addEventHandler}>
                        <IcNewDoc className="icon" />
                        <span>New Event</span>
                    </button>
                </div>
            )}
            <div className="flex gap-x-6">
                {/* <div className="relative overflow-hidden btn">
                    <input
                        type="file"
                        accept=".json,.xls,.xlsm"
                        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                        onChange={(e) =>
                            importSettings(e.target.files[0], setLabelsData)
                        }
                    />
                    <IcImport className="icon" />
                    <span>Import</span>
                </div>
                <button
                    className="btn-success"
                    onClick={(e) =>
                        exportSettings(labelsData, "settings.sh-maker")
                    }
                >
                    <IcExport className="icon" />
                    <span>Export</span>
                </button> */}
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
        </div>
    );
};

export default OptionBar;

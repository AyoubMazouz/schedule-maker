import React from "react";
import { Button } from "../../../components/Button";
import {
    IcBin,
    IcDown,
    IcEvent,
    IcLevel,
    IcNewDoc,
    IcRoom,
    IcSave,
    IcUser,
} from "../../../components/icons";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useLabels from "../../../hooks/useLabels";

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
    const { getLabels, setLabels } = useLabels();

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
            type: "addLevel",
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
            <Button
                text="add"
                onClick={() => setCurrMenu("add")}
                Icon={IcDown}
            />
            {currMenu === "add" && (
                <div ref={menuRef} className="menu top-[96%] left-[1%]">
                    <button className="menu-item" onClick={addFacultyHandler}>
                        <IcLevel className="icon" />
                        <span>New Level</span>
                    </button>
                    <button className="menu-item" onClick={addTrainerHandler}>
                        <IcUser className="icon" />
                        <span>New Trainer</span>
                    </button>
                    <button className="menu-item" onClick={addRoomHandler}>
                        <IcRoom className="icon" />
                        <span>New Room</span>
                    </button>
                    <button className="menu-item" onClick={addEventHandler}>
                        <IcEvent className="icon" />
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
                <Button
                    type="success"
                    text="save"
                    disabled={saved}
                    onClick={saveHandler}
                    Icon={IcSave}
                />
                <Button
                    text="discard"
                    disabled={saved}
                    onClick={discardChanges}
                    Icon={IcBin}
                />
            </div>
        </div>
    );
};

export default OptionBar;

import React from "react";
import { IcBin, IcDown, IcNewDoc, IcSave } from "../../../components/icons";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";

const OptionBar = ({
    menuRef,
    currMenu,
    setCurrMenu,
    saved,
    setSaved,
    data,
    setData,
}) => {
    const { setModel } = useGlobalContext();
    const { getLabels, setLabels } = useSettings();

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

    const addFacultyHandler = () => {
        setModel({ type: "addFaculty", data, setData, setSaved });
    };
    const addTrainerHandler = () => {
        setModel({ type: "addTrainer", data, setData, setSaved });
    };
    const addRoomHandler = () => {
        setModel({ type: "addRoom", data, setData, setSaved });
    };
    const addEventHandler = () => {
        setModel({ type: "addEvent", data, setData, setSaved });
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

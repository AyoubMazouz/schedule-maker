import React from "react";
import { IcBin, IcEdit, IcLevel } from "../../../components/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";

const Levels = ({
    currMenu,
    setCurrMenu,
    menuRef,
    setSaved,
    labelsData,
    setLabelsData,
}) => {
    const { setModel } = useGlobalContext();
    const { deleteLevel } = useSettings();
    const showDetailsHandler = (v) => {
        const details = [
            ["id", v.id],
            ["level", v.name],
            ["number of groups", v.numberOfGroups],
            ["created at", v.createdAt.toDate().toDateString()],
            ["modified at", v.modifiedAt.toDate().toDateString()],
            ["modules", v.modules.join(", ")],
        ];
        setModel({ type: "showDetails", details });
    };
    const deleteHandler = (value) => {
        deleteLevel(labelsData, setLabelsData, value.id);
        setSaved(false);
    };
    const editHandler = (value) => {
        setModel({
            type: "addLevel",
            labelsData,
            setLabelsData,
            setSaved,
            value,
            update: true,
        });
    };
    return (
        <div className="border-2 rounded-lg shadow-lg border-dark/25">
            {labelsData.levels.map((value, index) => (
                <div
                    key={value.name}
                    className={`menu-item group flex justify-between text-center ${
                        index % 2 === 0 && "bg-dark/5"
                    }`}
                >
                    <button
                        onClick={() => showDetailsHandler(value)}
                        className="grid w-full grid-cols-12"
                    >
                        <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
                            <IcLevel className="inline-block icon" />
                            <span>{value.name}</span>
                        </div>
                        <div className="hidden col-span-3 md:block">
                            {value.createdAt.toDate().toDateString()}
                        </div>
                    </button>
                    <MoreMenu
                        menuId={`levels:${value.name}`}
                        menuRef={menuRef}
                        currMenu={currMenu}
                        setCurrMenu={setCurrMenu}
                        options={[
                            ["edit", () => editHandler(value), IcEdit],
                            ["delete", () => deleteHandler(value), IcBin],
                        ]}
                    />
                </div>
            ))}
        </div>
    );
};

export default Levels;

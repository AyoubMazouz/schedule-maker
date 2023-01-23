import React from "react";
import {
    IcDoc,
    IcBin,
    IcMore,
    IcEdit,
    IcRoom,
    IcFaculty,
} from "../../../components/icons";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/usePublish";

const Faculties = ({
    currMenu,
    setCurrMenu,
    menuRef,
    setSaved,
    labelsData,
    setLabelsData,
}) => {
    const { setModel } = useGlobalContext();
    const { deleteFaculty } = useSettings();
    const showDetails = (v) => {
        const details = [
            ["id", v.id],
            ["faculty", v.name],
            ["number of first year groups", v.firstYear],
            ["number of second year groups", v.secondYear],
            ["created at", v.createdAt.toDate().toDateString()],
            ["modified at", v.modifiedAt.toDate().toDateString()],
            ["first year modules", v.firstYearModules.join(", ")],
            ["second year modules", v.secondYearModules.join(", ")],
        ];
        setModel({ type: "showDetails", details });
    };
    const editFaculty = (value) => {
        setModel({
            type: "addFaculty",
            labelsData,
            setLabelsData,
            setSaved,
            value,
            update: true,
        });
    };
    return (
        <div className="rounded-lg border-2 border-dark/25 shadow-lg">
            {labelsData.faculties.map((value, index) => (
                <div
                    key={value}
                    className={`menu-item group flex justify-between text-center ${
                        index % 2 === 0 && "bg-dark/5"
                    }`}
                >
                    <button
                        onClick={(e) => showDetails(value)}
                        className="grid w-full grid-cols-12"
                    >
                        <div className="col-span-full space-x-1 text-left group-hover:underline sm:col-span-9">
                            <IcFaculty className="icon inline-block" />
                            <span>{value.name}</span>
                        </div>
                        <div className="col-span-3 hidden md:block">
                            {value.createdAt.toDate().toDateString()}
                        </div>
                    </button>
                    <div className="relative flex gap-x-2 text-end">
                        <button
                            onClick={(e) =>
                                setCurrMenu(`faculty:${value.name}`)
                            }
                        >
                            <IcMore
                                className={
                                    currMenu === `faculty:${value.name}`
                                        ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                        : "text-xl"
                                }
                            />
                        </button>
                        {currMenu === `faculty:${value.name}` && (
                            <div
                                ref={menuRef}
                                className="menu top-[0%] left-[0%] translate-x-[-100%]"
                            >
                                <button
                                    className="menu-item"
                                    onClick={(e) => editFaculty(value)}
                                >
                                    <IcEdit className="icon" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    className="menu-item"
                                    onClick={() => {
                                        deleteFaculty(
                                            labelsData,
                                            setLabelsData,
                                            value.id
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
    );
};

export default Faculties;

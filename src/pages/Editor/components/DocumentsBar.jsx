import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useEditor from "../../../hooks/useEditor";
import useSettings from "../../../hooks/useSettings";
import { IcBin, IcDelete, IcPlus, IcTime } from "../../../components/icons";
import { useEditorContext } from "../../../Contexts/EditorContext";

const DocumentsBar = () => {
    const { saved, setSaved } = useEditorContext();
    const { data, setData, setAlert } = useGlobalContext();
    const { loading, addNewSchedual, editSchedualInfo, deleteSchedual } =
        useEditor();
    const { getLabels } = useSettings();

    const [currSchedual, setCurrSchedual] = React.useState(0);
    const [labels, setLabels] = React.useState({
        groups: [],
        trainers: [],
        rooms: [],
    });

    const [usedGroups, setUsedGroups] = React.useState([]);
    React.useEffect(() => {
        getLabels().then((labels) => {
            const groups = [];
            labels.faculties.forEach((faculty) => {
                for (let i = 1; i <= faculty.firstYear; i++) {
                    groups.push(
                        `${faculty.name} ${i >= 10 ? `1${i}` : `10${i}`}`
                    );
                }
                for (let i = 1; i <= faculty.secondYear; i++) {
                    groups.push(
                        `${faculty.name} ${i >= 10 ? `2${i}` : `20${i}`}`
                    );
                }
            });
            setLabels({
                trainers: labels.trainers,
                rooms: labels.rooms,
                groups,
            });
        });
    }, []);
    React.useEffect(() => {
        setUsedGroups(data.map((schedual) => schedual.group));
    }, [data]);

    const addNewSchedualHandler = () => {
        if (addNewSchedual(data, setData, setAlert)) {
            setCurrSchedual(data.length);
            setSaved(false);
        }

        const newDoc = document.getElementById(`new_doc`);
        const timeOut = setTimeout(() => {
            const editorEle = document.getElementById(`doc_${data.length}`);
            if (editorEle) {
                editorEle.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                });
                newDoc.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                });
            }
            return () => clearTimeout(timeOut);
        }, 10);
    };

    const editSchedualInfoHandler = (schedualIndex, info, value) => {
        const res = editSchedualInfo(
            data,
            setData,
            setAlert,
            schedualIndex,
            info,
            value
        );
        if (res) setSaved(false);
    };

    const deleteSchedualHandler = (schedualIndex) => {
        if (schedualIndex === data.length - 1)
            setCurrSchedual(schedualIndex - 1);
        const res = deleteSchedual(data, setData, data[schedualIndex].id);
        if (res) setSaved(false);
    };
    const selectSchedualHandler = (schedualIndex) => {
        setCurrSchedual(schedualIndex);
        const editorEle = document.getElementById(`doc_${schedualIndex}`);

        editorEle.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
        });
    };

    return (
        <div className="flex flex-col p-2 gap-y-3">
            {data.map((schedual, schedualIndex) =>
                schedualIndex === currSchedual ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-2 rounded-lg border-dark/25 bg-primary">
                        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-light text-primary">
                            {schedualIndex + 1}
                        </div>
                        <select
                            name="group"
                            className="input bg-primary text-light ring-light focus:bg-light focus:ring-secondary"
                            placeholder="Select a group..."
                            value={schedual.group}
                            onChange={(e) =>
                                editSchedualInfoHandler(
                                    schedualIndex,
                                    "group",
                                    e.target.value
                                )
                            }
                        >
                            <option value="" disabled className="text-light">
                                Group...
                            </option>
                            {labels.groups.map((group) => {
                                return (
                                    <option
                                        value={group}
                                        className={
                                            usedGroups.includes(group)
                                                ? "bg-rose-600 text-light"
                                                : "text-light"
                                        }
                                    >
                                        {group}
                                    </option>
                                );
                            })}
                        </select>
                        <button
                            className="p-1 rounded-full btn-danger"
                            onClick={(e) =>
                                deleteSchedualHandler(schedualIndex)
                            }
                        >
                            <IcBin className="icon" />
                        </button>
                    </div>
                ) : (
                    <button
                        className="flex items-center gap-2 p-2 border-2 rounded-lg border-dark/25"
                        onClick={(e) => selectSchedualHandler(schedualIndex)}
                    >
                        <div className="flex items-center justify-center w-8 h-8 text-lg font-bold rounded-full bg-primary text-light">
                            {schedualIndex + 1}
                        </div>
                        <div className="">{schedual.group}</div>
                        <div className="flex items-center ml-auto font-semibold gap-x-1 text-primary">
                            <span>{schedual.totalHours}</span>
                            <IcTime className="icon" />
                        </div>
                    </button>
                )
            )}
            <div>
                <button
                    className="justify-center w-full btn-success"
                    id="new_doc"
                    disabled={loading}
                    onClick={addNewSchedualHandler}
                >
                    <IcPlus className="icon" />
                    <span className="text-center">Add</span>
                </button>
            </div>
        </div>
    );
};

export default DocumentsBar;

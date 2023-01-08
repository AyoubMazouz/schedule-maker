import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useEditor from "../useEditor";
import useSettings from "../../../hooks/useSettings";
import { IcDelete, IcPlus, IcTime } from "../../../components/icons";

const DocumentsBar = () => {
    const { data, setData, setAlert } = useGlobalContext();
    const { loading, addNewSchedual, editSchedualInfo, deleteSchedual } =
        useEditor();
    const { getAllLabels } = useSettings();

    const [currSchedual, setCurrSchedual] = React.useState(0);
    const [labels, setLabels] = React.useState({
        groups: [],
        profNames: [],
        rooms: [],
    });

    const [usedGroups, setUsedGroups] = React.useState([]);
    React.useEffect(() => {
        getAllLabels().then((labels) => setLabels(labels));

        // Check for used Groups.
        setUsedGroups(data.map((schedual) => schedual.group));
    }, [data]);

    const addNewSchedualHandler = () => {
        if (addNewSchedual(data, setData, setAlert)) {
            setCurrSchedual(data.length);
        }

        const newDoc = document.getElementById(`new_doc`);
        const timeOut = setTimeout(() => {
            const editorEle = document.getElementById(`doc_${data.length}`);
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
            return () => clearTimeout(timeOut);
        }, 10);
    };

    const editSchedualInfoHandler = (schedualIndex, info, value) => {
        editSchedualInfo(data, setData, setAlert, schedualIndex, info, value);
    };

    const deleteSchedualHandler = (schedualIndex) => {
        if (schedualIndex === data.length - 1)
            setCurrSchedual(schedualIndex - 1);
        deleteSchedual(data, setData, setAlert, data[schedualIndex].id);
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
        <div className="flex flex-col gap-y-3 p-2">
            {data.map((schedual, schedualIndex) =>
                schedualIndex === currSchedual ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-2 border-dark/25 bg-primary p-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-light text-lg font-bold text-primary">
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
                            className="btn-danger rounded-full p-1"
                            onClick={(e) =>
                                deleteSchedualHandler(schedualIndex)
                            }
                        >
                            <IcDelete className="icon" />
                        </button>
                    </div>
                ) : (
                    <button
                        className="flex items-center gap-2 rounded-lg border-2 border-dark/25 p-2"
                        onClick={(e) => selectSchedualHandler(schedualIndex)}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-light">
                            {schedualIndex + 1}
                        </div>
                        <div className="">{schedual.group}</div>
                        <div className="ml-auto flex items-center gap-x-1 font-semibold text-primary">
                            <span>{schedual.totalHours}</span>
                            <IcTime className="icon" />
                        </div>
                    </button>
                )
            )}
            <div>
                <button
                    className="btn-success w-full justify-center"
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

import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcBin, IcPlus, IcTime } from "../../components/icons";
import { useEditorContext } from "../../Contexts/EditorContext";
import useLabels from "../../hooks/useLabels";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { useAuth } from "../../Contexts/AuthContext";

const DocumentsBar = () => {
    const { setSaved } = useEditorContext();
    const { data, setData, setAlert, labelsData, loadLabelsData } =
        useGlobalContext();
    const { addNewSchedual, editSchedualInfo, deleteSchedual } = useEditor();
    const { currUser } = useAuth();

    const [currSchedual, setCurrSchedual] = React.useState(0);

    const [groups, setGroups] = React.useState([]);
    const [usedGroups, setUsedGroups] = React.useState([]);

    React.useEffect(() => {
        loadLabelsData(currUser.uid);
    }, []);

    React.useEffect(() => {
        const groups = [];
        labelsData.levels.forEach((level) => {
            for (let i = 1; i <= level.numberOfGroups; i++) {
                groups.push(`${level.name} ${i}`);
            }
        });
        setGroups(groups);
    }, [labelsData]);
    React.useEffect(() => {
        setUsedGroups(data.map((schedual) => schedual.group));
        setGroups(groups.filter((grp) => !usedGroups.includes(grp)));
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
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border rounded-lg bg-primary">
                        <div className="flex items-center justify-center w-6 h-6 font-bold rounded-full text bg-light text-primary">
                            {schedualIndex + 1}
                        </div>
                        <Select
                            styles="px-1 text-sm"
                            values={groups}
                            defaultValue={schedual.group}
                            notRecommended={usedGroups}
                            label="groups"
                            onChange={(e) =>
                                editSchedualInfoHandler(
                                    schedualIndex,
                                    "group",
                                    e.target.value
                                )
                            }
                        />
                        <Button
                            Icon={IcBin}
                            label={["delete schedual"]}
                            styles="text-light"
                            onClick={(e) =>
                                deleteSchedualHandler(schedualIndex)
                            }
                        />
                    </div>
                ) : (
                    <button
                        className="flex items-center gap-2 p-2 text-sm font-semibold transition-all duration-300 border rounded-lg bg-light hover:bg-secondary"
                        onClick={(e) => selectSchedualHandler(schedualIndex)}
                    >
                        <div className="flex items-center justify-center w-6 h-6 font-bold rounded-full bg-primary text-light">
                            {schedualIndex + 1}
                        </div>
                        <div className="">{schedual.group}</div>
                        <div className="flex items-center ml-auto gap-x-1 text-primary">
                            <span>{schedual.totalHours}</span>
                            <IcTime className="icon" />
                        </div>
                    </button>
                )
            )}
            <Button
                type="success"
                Icon={IcPlus}
                text="add"
                onClick={addNewSchedualHandler}
                styles="flex justify-center"
            />
        </div>
    );
};

export default DocumentsBar;

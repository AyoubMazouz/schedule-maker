import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcBin, IcPlus, IcTime } from "../../helpers/icons";
import { useEditorContext } from "../../Contexts/EditorContext";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { useAuth } from "../../Contexts/AuthContext";

const DocumentsBar = () => {
  const { setSaved } = useEditorContext();
  const { data, setData, setAlert, labelsData } = useGlobalContext();
  const { addNewSchedual, editSchedualGrp, deleteSchedual, getGroups } =
    useEditor();
  const { currUser } = useAuth();

  const [currSchedual, setCurrSchedual] = React.useState(0);

  const [availableGroups, setAvailableGroups] = React.useState([]);
  const [unavailableGroups, setUnavailableGroups] = React.useState([]);

  React.useEffect(() => {
    const [availableGroups, unavailableGroups] = getGroups(
      data,
      labelsData,
      currSchedual
    );
    setAvailableGroups(availableGroups);
    setUnavailableGroups(unavailableGroups);
  }, [currSchedual, data]);

  const addNewSchedualHandler = () => {
    const res = addNewSchedual(data, setData, setAlert);
    if (res) {
      setCurrSchedual(data.length);
      setSaved(false);
    } else {
      setAlert({
        type: "warn",
        message:
          "You should finish the previous table or at least fill the 'group' field.",
      });
    }
    // Scroll to the new schedule.
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

  const editSchedualGrpHandler = (schedualIndex, value) => {
    const res = editSchedualGrp(data, setData, schedualIndex, value);
    if (res) {
      setSaved(false);
    } else {
      setAlert({
        type: "warn",
        message: "You have already created a Schedual for this group",
      });
    }
  };

  const deleteSchedualHandler = (scheduleIndex) => {
    if (scheduleIndex === data.length - 1) setCurrSchedual(scheduleIndex - 1);
    const res = deleteSchedual(data, setData, data[scheduleIndex].id);
    if (res) setSaved(false);
  };
  const selectSchedualHandler = (scheduleIndex) => {
    setCurrSchedual(scheduleIndex);
    const editorEle = document.getElementById(`doc_${scheduleIndex}`);

    editorEle.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  };

  return (
    <div className="flex flex-col p-2 gap-y-3">
      {data.map((schedule, scheduleIndex) =>
        scheduleIndex === currSchedual ? (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 border rounded-lg bg-primary">
            <div className="flex items-center justify-center w-6 h-6 font-bold rounded-full text bg-light text-primary">
              {scheduleIndex + 1}
            </div>
            <Select
              styles="px-1 text-sm"
              values={availableGroups}
              value={schedule.group}
              notRecommended={unavailableGroups}
              label="groups"
              onChange={(e) =>
                editSchedualGrpHandler(scheduleIndex, e.target.value)
              }
            />
            <Button
              Icon={IcBin}
              label={["delete schedule"]}
              styles="text-light"
              onClick={(e) => deleteSchedualHandler(scheduleIndex)}
            />
          </div>
        ) : (
          <button
            className="flex items-center gap-2 p-2 text-sm font-semibold transition-all duration-300 border rounded-lg bg-light hover:bg-secondary"
            onClick={(e) => selectSchedualHandler(scheduleIndex)}
          >
            <div className="flex items-center justify-center w-6 h-6 font-bold rounded-full bg-primary text-light">
              {scheduleIndex + 1}
            </div>
            <div className="">{schedule.group}</div>
            <div className="flex items-center ml-auto gap-x-1 text-primary">
              <span>{schedule.totalHours}</span>
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

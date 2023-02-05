import React from "react";
import { IcBin, IcEdit, IcLevel } from "../../../helpers/icons";
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
      ["level", v.value],
      ["number of groups", v.numOfGrps],
      ["created at", v.createdAt.toDate().toDateString()],
      ["modified at", v.modifiedAt.toDate().toDateString()],
      ["modules", v.modules.join(", ")],
    ];
    setModel({ type: "showDetails", details });
  };
  const deleteHandler = (level) => {
    const res = deleteLevel(labelsData, level.value);
    if (res) {
      setLabelsData(res);
      setSaved(false);
    }
  };
  const editHandler = (level) => {
    setModel({
      type: "UPDATE_LEVEL",
      setSaved,
      level,
    });
  };
  return (
    <div className="border-2 rounded-lg shadow-lg border-dark/25">
      {labelsData.levels.map((level, index) => (
        <div
          key={level.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/5"
          }`}
        >
          <button
            onClick={() => showDetailsHandler(level)}
            className="grid w-full grid-cols-12"
          >
            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
              <IcLevel className="inline-block icon" />
              <span>{level.value}</span>
            </div>
            <div className="hidden col-span-3 md:block">
              {level.createdAt.toDate().toDateString()}
            </div>
          </button>
          <MoreMenu
            menuId={`levels:${level.value}`}
            menuRef={menuRef}
            currMenu={currMenu}
            setCurrMenu={setCurrMenu}
            options={[
              ["edit", () => editHandler(level), IcEdit],
              ["delete", () => deleteHandler(level), IcBin],
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default Levels;

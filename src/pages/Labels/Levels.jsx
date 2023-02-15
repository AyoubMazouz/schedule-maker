import React from "react";
import { IcBin, IcEdit, IcHelp, IcLevel } from "../../helpers/icons";
import MoreMenu from "../../components/MoreMenu";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { getRelativeDate } from "../../helpers/util";
import { Button } from "../../components/Button";

const Levels = ({ currMenu, setCurrMenu, menuRef, setSaved }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteLevel } = useSettings();
  const showDetailsHandler = (v) => {
    const details = [
      ["level", v.value],
      ["number of groups", v.numOfGrps],
      ["modules", v.modules.join(", ")],
      ["description", v.desc],
      ["modified at", getRelativeDate(v.modifiedAt)],
      ["created at", getRelativeDate(v.createdAt)],
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
    <div className="rounded-lg border shadow-lg">
      <div className="flex items-center border-b-2 border-dark/50 bg-primary pr-1 text-start text-light">
        <div className="grid w-full grid-cols-12 p-2 font-semibold">
          <div className="col-span-full sm:col-span-9 md:col-span-6">
            Levels
          </div>
          <div className="col-span-3 hidden text-center sm:block">
            Modified At
          </div>
          <div className="col-span-3 hidden text-center md:block">
            Created At
          </div>
        </div>
        <Button Icon={IcHelp} label={["levels"]} />
      </div>
      {labelsData.levels.map((level, index) => (
        <div
          key={level.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/10"
          }`}
        >
          <button
            onClick={() => showDetailsHandler(level)}
            className="grid w-full grid-cols-12"
          >
            <div className="col-span-full flex gap-x-1 text-left group-hover:underline sm:col-span-6">
              <IcLevel className="icon inline-block" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {level.value}
              </div>
            </div>
            <div className="col-span-3 hidden text-center md:block">
              {getRelativeDate(level.modifiedAt)}
            </div>
            <div className="col-span-3 hidden text-center sm:block">
              {getRelativeDate(level.createdAt)}
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

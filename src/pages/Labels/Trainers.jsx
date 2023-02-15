import React from "react";
import { IcBin, IcEdit, IcHelp, IcUser } from "../../helpers/icons";
import MoreMenu from "../../components/MoreMenu";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { getRelativeDate } from "../../helpers/util";
import { Button } from "../../components/Button";

const Trainers = ({ currMenu, setCurrMenu, menuRef, setSaved }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteTrainer } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["trainer", v.value],
      ["description", v.desc],
      ["modified at", getRelativeDate(v.modifiedAt)],
      ["created at", getRelativeDate(v.createdAt)],
    ];
    setModel({ type: "showDetails", details });
  };
  const editHandler = (trainer) => {
    setModel({
      type: "UPDATE_TRAINER",
      setSaved,
      trainer,
    });
  };
  const deleteHandler = (value) => {
    deleteTrainer(labelsData, setLabelsData, value.id);
    setSaved(false);
  };
  return (
    <div className="rounded-lg border shadow-lg">
      <div className="flex items-center border-2 border-dark/50 bg-primary pr-1 text-start text-light">
        <div className="grid w-full grid-cols-12 p-2 font-semibold">
          <div className="col-span-full sm:col-span-9 md:col-span-6">
            Trainers
          </div>
          <div className="col-span-3 hidden text-center sm:block">
            Modified At
          </div>
          <div className="col-span-3 hidden text-center md:block">
            Created At
          </div>
        </div>
        <Button Icon={IcHelp} label={["trainers"]} />
      </div>
      {labelsData.trainers.map((trainer, index) => (
        <div
          key={trainer.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/10"
          }`}
        >
          <button
            onClick={(e) => showDetails(trainer)}
            className="grid w-full grid-cols-12"
          >
            <div className="col-span-full flex gap-x-1 text-left group-hover:underline sm:col-span-6">
              <IcUser className="icon" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {trainer.value}
              </div>
            </div>
            <div className="col-span-3 hidden text-center md:block">
              {getRelativeDate(trainer.modifiedAt)}
            </div>
            <div className="col-span-3 hidden text-center sm:block">
              {getRelativeDate(trainer.createdAt)}
            </div>
          </button>
          <MoreMenu
            menuId={`trainer:${trainer.value}`}
            menuRef={menuRef}
            currMenu={currMenu}
            setCurrMenu={setCurrMenu}
            options={[
              ["edit", () => editHandler(trainer), IcEdit],
              ["delete", () => deleteHandler(trainer), IcBin],
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default Trainers;

import React from "react";
import { IcBin, IcEdit, IcUser } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";

const Trainers = ({
  currMenu,
  setCurrMenu,
  menuRef,
  setSaved,
  labelsData,
  setLabelsData,
}) => {
  const { setModel } = useGlobalContext();
  const { deleteTrainer } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["id", v.id],
      ["trainer", v.value],
      ["created at", v.createdAt.toDate().toDateString()],
      ["modified at", v.modifiedAt.toDate().toDateString()],
      ["preferred rooms", v.preferredRooms.join(", ")],
    ];
    setModel({ type: "showDetails", details });
  };
  const editHandler = (trainer) => {
    setModel({
      type: "updateTrainer",
      setSaved,
      trainer,
    });
  };
  const deleteHandler = (value) => {
    deleteTrainer(labelsData, setLabelsData, value.id);
    setSaved(false);
  };
  return (
    <div className="border-2 rounded-lg shadow-lg border-dark/25">
      {labelsData.trainers.map((trainer, index) => (
        <div
          key={trainer.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/5"
          }`}
        >
          <button
            onClick={(e) => showDetails(trainer)}
            className="grid w-full grid-cols-12"
          >
            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
              <IcUser className="inline-block icon" />
              <span>{trainer.value}</span>
            </div>
            <div className="hidden col-span-3 md:block">
              {trainer.createdAt.toDate().toDateString()}
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

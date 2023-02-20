import React from "react";
import { IcAbout, IcBin, IcEdit, IcHelp, IcUser } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { getRelativeDate } from "../../../helpers/util";
import Table from "../../../components/Table";

const Trainers = ({ currMenu, setCurrMenu, menuRef, setSaved, search }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteTrainer } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["trainer", v.id],
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
  const deleteHandler = (id) => {
    deleteTrainer(labelsData, setLabelsData, id.id);
    setSaved(false);
  };
  return (
    <Table
      {...{
        id: "Trainers",
        documents: labelsData.trainers,
        search,
        goTo: (v) => showDetails(v),
        moreMenu: (v) => (
          <MoreMenu
            menuId={`trainers:${v.id}`}
            menuRef={menuRef}
            currMenu={currMenu}
            setCurrMenu={setCurrMenu}
            options={[
              ["edit", () => editHandler(v), IcEdit],
              ["delete", () => deleteHandler(v), IcBin],
            ]}
          />
        ),
      }}
    />
  );
};

export default Trainers;

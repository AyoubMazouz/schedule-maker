import React from "react";
import { IcAbout, IcBin, IcEdit } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { getRelativeDate } from "../../../helpers/util";
import Table from "../../../components/Table";

const Levels = ({ currMenu, setCurrMenu, menuRef, setSaved, search }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteLevel } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["level", v.id],
      ["number of groups", v.numOfGrps],
      ["modules", v.modules.join(", ")],
      ["description", v.desc],
      ["modified at", getRelativeDate(v.modifiedAt)],
      ["created at", getRelativeDate(v.createdAt)],
    ];
    setModel({ type: "showDetails", details });
  };
  const deleteHandler = (level) => {
    const res = deleteLevel(labelsData, level.id);
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
    <Table
      {...{
        id: "levels",
        documents: labelsData.levels,
        search,
        goTo: (v) => showDetails(v),
        moreMenu: (v) => (
          <MoreMenu
            menuId={`levels:${v.id}`}
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

export default Levels;

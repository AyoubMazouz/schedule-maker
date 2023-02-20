import React from "react";
import { IcAbout, IcBin, IcEdit } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { getRelativeDate } from "../../../helpers/util";
import Table from "../../../components/Table";

const Rooms = ({ currMenu, setCurrMenu, menuRef, setSaved, search }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteRoom } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["room", v.id],
      ["description", v.desc],
      ["modified at", getRelativeDate(v.modifiedAt)],
      ["created at", getRelativeDate(v.createdAt)],
    ];
    setModel({ type: "showDetails", details });
  };
  const editHandler = (room) => {
    setModel({
      type: "UPDATE_ROOM",
      setSaved,
      room,
    });
  };
  const deleteHandler = (room) => {
    const res = deleteRoom(labelsData, room.id);
    if (res) {
      setLabelsData(res);
      setSaved(false);
    }
  };

  return (
    <Table
      {...{
        id: "rooms",
        documents: labelsData.rooms,
        search,
        goTo: (v) => showDetails(v),
        moreMenu: (v) => (
          <MoreMenu
            menuId={`rooms:${v.id}`}
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

export default Rooms;

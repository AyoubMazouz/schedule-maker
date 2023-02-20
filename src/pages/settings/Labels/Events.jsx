import React from "react";
import { IcAbout, IcBin, IcEdit } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { getRelativeDate } from "../../../helpers/util";
import Table from "../../../components/Table";

const Events = ({ currMenu, setCurrMenu, menuRef, setSaved, search }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteEvent } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["event", v.id],
      ["description", v.desc],
      ["modified at", getRelativeDate(v.modifiedAt)],
      ["created at", getRelativeDate(v.createdAt)],
    ];
    setModel({ type: "showDetails", details });
  };
  const editHandler = (event) => {
    setModel({
      type: "UPDATE_EVENT",
      setSaved,
      event,
    });
  };
  const deleteHandler = (event) => {
    const res = deleteEvent(labelsData, event.id);
    if (res) {
      setLabelsData(res);
      setSaved(false);
    }
  };

  return (
    <Table
      {...{
        id: "events",
        documents: labelsData.events,
        search,
        goTo: (v) => showDetails(v),
        moreMenu: (v) => (
          <MoreMenu
            menuId={`event:${v.id}`}
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

export default Events;

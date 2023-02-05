import React from "react";
import { IcBin, IcEdit, IcEvent } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";

const Events = ({
  currMenu,
  setCurrMenu,
  menuRef,
  setSaved,
  labelsData,
  setLabelsData,
}) => {
  const { setModel } = useGlobalContext();
  const { deleteEvent } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["id", v.id],
      ["event", v.value],
      ["created at", v.createdAt.toDate().toDateString()],
      ["modified at", v.modifiedAt.toDate().toDateString()],
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
    const res = deleteEvent(labelsData, event.value);
    if (res) {
      setLabelsData(res);
      setSaved(false);
    }
  };
  return (
    <div className="border-2 rounded-lg shadow-lg border-dark/25">
      {labelsData.events.map((event, index) => (
        <div
          key={event.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/5"
          }`}
        >
          <button
            onClick={(e) => showDetails(event)}
            className="grid w-full grid-cols-12"
          >
            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
              <IcEvent className="inline-block icon" />
              <span>{event.value}</span>
            </div>
            <div className="hidden col-span-3 md:block">
              {event.createdAt.toDate().toDateString()}
            </div>
          </button>
          <MoreMenu
            menuId={`event:${event.value}`}
            menuRef={menuRef}
            currMenu={currMenu}
            setCurrMenu={setCurrMenu}
            options={[
              ["edit", () => editHandler(event), IcEdit],
              ["delete", () => deleteHandler(event), IcBin],
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default Events;

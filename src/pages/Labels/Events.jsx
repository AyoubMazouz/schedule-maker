import React from "react";
import { IcBin, IcEdit, IcEvent, IcHelp } from "../../helpers/icons";
import MoreMenu from "../../components/MoreMenu";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { getRelativeDate } from "../../helpers/util";
import { Button } from "../../components/Button";

const Events = ({ currMenu, setCurrMenu, menuRef, setSaved }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteEvent } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["event", v.value],
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
    const res = deleteEvent(labelsData, event.value);
    if (res) {
      setLabelsData(res);
      setSaved(false);
    }
  };

  return (
    <div className="rounded-lg border shadow-lg">
      <div className="flex items-center border-b-2 border-dark/50 bg-primary pr-1 text-start text-light">
        <div className="grid w-full grid-cols-12 p-2 font-semibold">
          <div className="col-span-full sm:col-span-9 md:col-span-6">
            Events
          </div>
          <div className="col-span-3 hidden text-center sm:block">
            Modified At
          </div>
          <div className="col-span-3 hidden text-center md:block">
            Created At
          </div>
        </div>
        <Button Icon={IcHelp} label={["Events"]} />
      </div>
      {labelsData.events.map((event, index) => (
        <div
          key={event.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/10"
          }`}
        >
          <button
            onClick={(e) => showDetails(event)}
            className="grid w-full grid-cols-12"
          >
            <div className="col-span-full flex gap-x-1 text-left group-hover:underline sm:col-span-6">
              <IcEvent className="icon inline-block" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {event.value}
              </div>
            </div>
            <div className="col-span-3 hidden text-center md:block">
              {getRelativeDate(event.modifiedAt)}
            </div>
            <div className="col-span-3 hidden text-center sm:block">
              {getRelativeDate(event.createdAt)}
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

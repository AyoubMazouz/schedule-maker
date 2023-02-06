import React from "react";
import { IcBin, IcEdit, IcHelp, IcRoom } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { getRelativeDate } from "../../../helpers/util";
import { Button } from "../../../components/Button";

const Rooms = ({ currMenu, setCurrMenu, menuRef, setSaved }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { deleteRoom } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["room", v.value],
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
    const res = deleteRoom(labelsData, room.value);
    if (res) {
      setLabelsData(res);
      setSaved(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-lg">
      <div className="flex items-center pr-1 border-b-2 border-dark/50 bg-primary text-start text-light">
        <div className="grid w-full grid-cols-12 p-2 font-semibold">
          <div className="col-span-full sm:col-span-9 md:col-span-6">Rooms</div>
          <div className="hidden col-span-3 text-center sm:block">
            Modified At
          </div>
          <div className="hidden col-span-3 text-center md:block">
            Created At
          </div>
        </div>
        <Button Icon={IcHelp} label={["Rooms"]} />
      </div>
      {labelsData.rooms.map((room, index) => (
        <div
          key={room.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/10"
          }`}
        >
          <button
            onClick={() => showDetails(room)}
            className="grid w-full grid-cols-12"
          >
            <div className="flex text-left col-span-full gap-x-1 group-hover:underline sm:col-span-6">
              <IcRoom className="icon" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {room.value}
              </div>
            </div>
            <div className="hidden col-span-3 text-center md:block">
              {getRelativeDate(room.modifiedAt)}
            </div>
            <div className="hidden col-span-3 text-center sm:block">
              {getRelativeDate(room.createdAt)}
            </div>
          </button>
          <MoreMenu
            menuId={`room:${room.value}`}
            menuRef={menuRef}
            currMenu={currMenu}
            setCurrMenu={setCurrMenu}
            options={[
              ["edit", () => editHandler(room), IcEdit],
              ["delete", () => deleteHandler(room), IcBin],
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default Rooms;

import React from "react";
import { IcBin, IcEdit, IcRoom } from "../../../helpers/icons";
import MoreMenu from "../../../components/MoreMenu";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";

const Rooms = ({
  currMenu,
  setCurrMenu,
  menuRef,
  setSaved,
  labelsData,
  setLabelsData,
}) => {
  const { setModel } = useGlobalContext();
  const { deleteRoom } = useSettings();
  const showDetails = (v) => {
    const details = [
      ["id", v.id],
      ["room", v.value],
      ["created at", v.createdAt.toDate().toDateString()],
      ["modified at", v.modifiedAt.toDate().toDateString()],
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
    <div className="border-2 rounded-lg shadow-lg border-dark/25">
      {labelsData.rooms.map((room, index) => (
        <div
          key={room.value}
          className={`menu-item group flex justify-between text-center ${
            index % 2 === 0 && "bg-dark/5"
          }`}
        >
          <button
            onClick={() => showDetails(room)}
            className="grid w-full grid-cols-12"
          >
            <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9">
              <IcRoom className="inline-block icon" />
              <span>{room.value}</span>
            </div>
            <div className="hidden col-span-3 md:block">
              {room.createdAt.toDate().toDateString()}
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

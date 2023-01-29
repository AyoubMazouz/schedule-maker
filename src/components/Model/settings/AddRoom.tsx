import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcLogin } from "../../../helpers/icons";

const AddRoom = () => {
  const { model, setModel, setAlert, labelsData, setLabelsData } =
    useGlobalContext();
  const { addRoom } = useSettings();

  const [roomInput, setRoomInput] = React.useState("");

  const submitHandler = () => {
    const res = addRoom(labelsData, setLabelsData, roomInput);
    if (res) {
      model.setSaved(false);
      setModel(null);
    } else {
      setAlert({
        type: "warn",
        message: `room "${roomInput}" already exists!`,
      });
      setRoomInput("");
    }
  };

  return (
    <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
      <div
        className={`w-full space-y-4 rounded-lg border-2 border-dark/25 bg-light p-4 shadow-lg`}
      >
        <div className="text-center text-xl text-primary">Add New Room</div>
        <div className="flex flex-col items-center gap-2">
          <label className="input-label" htmlFor="room">
            Room:
          </label>
          <input
            className="input max-w-[26rem]"
            type="text"
            name="room"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
          />
        </div>
        <div className="flex gap-x-6">
          <Button
            text="add"
            type="success"
            onClick={submitHandler}
            Icon={IcLogin}
          />
          <Button
            text="Cancel"
            onClick={(e) => setModel(null)}
            Icon={IcCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
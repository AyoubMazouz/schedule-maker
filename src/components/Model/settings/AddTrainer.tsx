import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcEx, IcLogin } from "../../../helpers/icons";
import { Room } from "../../../helpers/types";

const AddTrainer = () => {
  const { model, setModel, setAlert, labelsData, setLabelsData } =
    useGlobalContext();
  const { addTrainer } = useSettings();

  const [trainerInput, setTrainerInput] = React.useState("");
  const [preferedRooms, setPreferedRooms] = React.useState<string[]>([]);

  const addNewRoomHandler = (room: string) => {
    const newPreferedRooms = preferedRooms.filter((r) => r !== room);

    if (newPreferedRooms.length !== preferedRooms.length) {
      return setAlert({
        type: "warn",
        message: `room number "${room} is already in the list"`,
      });
    }

    setPreferedRooms((rooms) => [...rooms, room]);
  };

  const removeRoomHandler = (value: string) => {
    const newPreferedRooms = preferedRooms.filter((room) => room !== value);
    setPreferedRooms(newPreferedRooms);
  };

  const submitHandler = (e: any) => {
    const res = addTrainer(
      labelsData,
      setLabelsData,
      trainerInput,
      preferedRooms
    );
    if (res) {
      model.setSaved(false);
      setModel(null);
    } else {
      setAlert({
        type: "warn",
        message: `Trainer "${trainerInput}" already exists!`,
      });
      setTrainerInput("");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-xl text-center text-primary">Add New Trainer</div>
        <div className="flex flex-col items-center gap-2">
          <label className="input-label" htmlFor="trainer">
            Trainer:
          </label>
          <input
            className="input max-w-[26rem]"
            type="text"
            name="trainer"
            value={trainerInput}
            onChange={(e) => {
              const value =
                e.target.value.charAt(0).toUpperCase() +
                e.target.value.slice(1);
              setTrainerInput(value);
            }}
          />
        </div>
        <div className="textbox">
          <span>Prefered Rooms: </span>
          {preferedRooms.map((room) => (
            <div key={room}>
              {room}
              <IcEx
                id="preferedRooms"
                onClick={(e) => removeRoomHandler(room)}
                className="textbox-icon"
              />
            </div>
          ))}
          <select
            name="preferedRooms"
            className="input"
            value=""
            onChange={(e) => addNewRoomHandler(e.target.value)}
          >
            <option value="" disabled>
              Rooms...
            </option>
            {labelsData.rooms.map((room: Room) => (
              <option key={room.value} value={room.value}>
                {room.value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="model-btn-container">
        <Button
          text="add"
          type="success"
          onClick={submitHandler}
          Icon={IcLogin}
        />
        <Button text="Cancel" onClick={(e) => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default AddTrainer;

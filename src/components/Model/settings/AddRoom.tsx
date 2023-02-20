import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcDesc, IcLogin, IcRoom } from "../../../helpers/icons";
import { isStrEmpty, treeCharsOrMore } from "../../../helpers/validation";
import { Input } from "../../Input";

const INITIAL_STATE = {
  room: { value: "", error: "" },
  desc: { value: "", error: "" },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "ROOM":
      return { ...state, room: { value: action.payload, error: "" } };
    case "DESC":
      var error =
        isStrEmpty(action.payload) || treeCharsOrMore(action.payload)
          ? ""
          : "description must be at least tree characters long!";
      return { ...state, desc: { value: action.payload, error } };
    default:
      return state;
  }
};

const AddRoom = () => {
  const { model, setModel, setAlert, labelsData, setLabelsData } =
    useGlobalContext();
  const { addRoom, updateRoom } = useSettings();

  const [state, dispatch] = React.useReducer(
    reducer,
    model.type === "ADD_ROOM"
      ? INITIAL_STATE
      : {
          room: { value: model.room.id, error: "" },
          desc: { value: model.room.desc, error: "" },
        }
  );

  const submitHandler = () => {
    // Check if room not empty and contains 1 char or more.
    if (isStrEmpty(state.room.value)) {
      return setAlert({
        type: "warn",
        message: `room is required, it must be a least one character or more.`,
      });
    }
    // Check if other conditions are met.
    else if (state.desc.error)
      return setAlert({
        type: "warn",
        message: state.desc.error,
      });
    // Check for errors or success.
    const res =
      model.type === "ADD_ROOM"
        ? addRoom(labelsData, state.room.value, state.desc.value)
        : updateRoom(
            labelsData,
            model.room,
            state.room.value,
            state.desc.value
          );
    if (res) {
      setLabelsData(res);
      model.setSaved(false);
      setModel(null);
    } else {
      setAlert({
        type: "warn",
        message: `room "${state.room.value}" already exists!`,
      });
      dispatch({ type: "ROOM", payload: "" });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-y-6">
        <div className="text-xl text-center text-primary">
          {model.type === "ADD_ROOM" ? "Add New room" : "Update Room"}
        </div>
        <div className="flex flex-col items-center gap-y-3">
          <Input
            type="text"
            label="room"
            placeholder="room..."
            Icon={IcRoom}
            required={true}
            value={state.room.value}
            onChange={(e) =>
              dispatch({ type: "ROOM", payload: e.target.value.toUpperCase() })
            }
          />
          <Input
            type="textarea"
            label="description"
            Icon={IcDesc}
            error={state.desc.error}
            placeholder="Description..."
            value={state.desc.value}
            onChange={(e) =>
              dispatch({ type: "DESC", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="model-btn-container">
        <Button
          text={model.type === "ADD_TRAINER" ? "Add" : "Update"}
          type="success"
          onClick={submitHandler}
          Icon={IcLogin}
        />
        <Button text="cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default AddRoom;

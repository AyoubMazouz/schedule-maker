import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import {
  IcCancel,
  IcDesc,
  IcEx,
  IcLogin,
  IcUser,
} from "../../../helpers/icons";
import { Room, Trainer } from "../../../helpers/types";
import { isStrEmpty, treeCharsOrMore } from "../../../helpers/validation";
import { Input } from "../../Input";

const INITIAL_STATE = {
  trainer: { value: "", error: "" },
  desc: { value: "", error: "" },
  preferredRooms: { value: [], error: "" },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "TRAINER":
      return {
        ...state,
        trainer: {
          value:
            action.payload.charAt(0).toUpperCase() + action.payload.slice(1),
          error: treeCharsOrMore(action.payload)
            ? ""
            : "Trainer must be at least tree characters or more.",
        },
      };
    case "DESC":
      var error =
        isStrEmpty(action.payload) || treeCharsOrMore(action.payload)
          ? ""
          : "description must be at least tree characters long!";
      return { ...state, desc: { value: action.payload, error } };
    case "ADD_ROOM":
      return {
        ...state,
        preferredRooms: {
          value: [...state.preferredRooms.value, action.payload],
          error: "",
        },
      };
    case "RM_ROOM":
      return {
        ...state,
        preferredRooms: {
          value: state.preferredRooms.value.filter(
            (r: string) => r !== action.payload
          ),
          error: "",
        },
      };
    default:
      return state;
  }
};

const AddTrainer = () => {
  const { model, setModel, setAlert, labelsData, setLabelsData } =
    useGlobalContext();
  const { addTrainer, updateTrainer } = useSettings();

  const [state, dispatch] = React.useReducer(
    reducer,
    model.type === "ADD_TRAINER"
      ? INITIAL_STATE
      : {
          trainer: { value: model.trainer.value, error: "" },
          desc: { value: model.trainer.desc, error: "" },
          preferredRooms: { value: model.trainer.preferredRooms, error: "" },
        }
  );

  const handleAddNewRoom = (room: string) => {
    if (state.preferredRooms.value.includes(room))
      return setAlert({
        type: "warn",
        message: `Room number "${room}" is already in the list`,
      });
    dispatch({ type: "ADD_ROOM", payload: room });
  };

  const submitHandler = () => {
    // Check if room not empty and contains 1 char or more.
    if (state.trainer.error) {
      return setAlert({
        type: "warn",
        message: state.trainer.error,
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
      model.type === "ADD_TRAINER"
        ? addTrainer(
            labelsData,
            state.trainer.value,
            state.preferredRooms.value,
            state.desc.value
          )
        : updateTrainer(
            labelsData,
            model.trainer,
            state.trainer.value,
            state.preferredRooms.value,
            state.desc.value
          );
    if (res) {
      setLabelsData(res);
      model.setSaved(false);
      setModel(null);
    } else {
      setAlert({
        type: "warn",
        message: `trainer "${state.trainer.value}" already exists!`,
      });
      dispatch({ type: "TRAINER", payload: "" });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-xl text-center text-primary">
          {model.type === "ADD_TRAINER" ? "Add New Trainer" : "Update Trainer"}
        </div>
        <Input
          type="text"
          label="trainer"
          placeholder="Trainer..."
          Icon={IcUser}
          error={state.trainer.error}
          required={true}
          value={state.trainer.value}
          onChange={(e) =>
            dispatch({ type: "TRAINER", payload: e.target.value })
          }
        />
        <div className="textbox">
          <span>Preferred Rooms: </span>
          {state.preferredRooms.value.map((room: string) => (
            <div key={room} className="max-h-[1.75rem]">
              {room}
              <IcEx
                onClick={(e) => dispatch({ type: "RM_ROOM", payload: room })}
                className="textbox-icon"
              />
            </div>
          ))}
          <select
            className="input"
            onChange={(e) => handleAddNewRoom(e.target.value)}
          >
            <option value="" disabled>
              rooms...
            </option>
            {labelsData.rooms.map((rooms: Room) => (
              <option key={rooms.value} value={rooms.value}>
                {rooms.value}
              </option>
            ))}
          </select>
        </div>
        <Input
          type="textarea"
          label="description"
          Icon={IcDesc}
          error={state.desc.error}
          placeholder="Description..."
          value={state.desc.value}
          onChange={(e) => dispatch({ type: "DESC", payload: e.target.value })}
        />
      </div>
      <div className="model-btn-container">
        <Button
          text={model.type === "ADD_TRAINER" ? "Add" : "Update"}
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

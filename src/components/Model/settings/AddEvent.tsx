import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcDesc, IcEvent, IcLogin } from "../../../helpers/icons";
import { Input } from "../../Input";
import { isStrEmpty, treeCharsOrMore } from "../../../helpers/validation";

const INITIAL_STATE = {
  event: { value: "", error: "" },
  desc: { value: "", error: "" },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "EVENT":
      return { ...state, event: { value: action.payload, error: "" } };
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

const AddEvent = () => {
  const { model, setModel, setAlert, labelsData, setLabelsData } =
    useGlobalContext();
  const { addEvent, updateEvent } = useSettings();
  const [state, dispatch] = React.useReducer(
    reducer,
    model.type === "ADD_EVENT"
      ? INITIAL_STATE
      : {
          event: { value: model.event.id, error: "" },
          desc: { value: model.event.desc, error: "" },
        }
  );

  const submitHandler = () => {
    // Check if event not empty and contains 1 char or more.
    if (isStrEmpty(state.event.id)) {
      return setAlert({
        type: "warn",
        message: `Event is required, it must be a least one character or more.`,
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
      model.type === "ADD_EVENT"
        ? addEvent(labelsData, state.event.value, state.desc.value)
        : updateEvent(
            labelsData,
            model.event,
            state.event.value,
            state.desc.value
          );
    if (res) {
      setLabelsData(res);
      model.setSaved(false);
      setModel(null);
    } else {
      setAlert({
        type: "warn",
        message: `event "${state.event.id}" already exists!`,
      });
      dispatch({ type: "EVENT", payload: "" });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-y-6">
        <div className="text-xl text-center text-primary">
          {model.type === "ADD_EVENT" ? "Add New Event" : "Update Event"}
        </div>
        <div className="flex flex-col items-center gap-y-3">
          <Input
            type="text"
            label="event"
            placeholder="Event..."
            Icon={IcEvent}
            required={true}
            value={state.event.value}
            onChange={(e) =>
              dispatch({ type: "EVENT", payload: e.target.value.toUpperCase() })
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
          text={model.type === "ADD_EVENT" ? "Add" : "Update"}
          type="success"
          onClick={submitHandler}
          Icon={IcLogin}
        />
        <Button text="cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default AddEvent;

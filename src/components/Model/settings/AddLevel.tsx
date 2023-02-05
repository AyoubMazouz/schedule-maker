import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcEx, IcLogin } from "../../../helpers/icons";
import { isStrEmpty, treeCharsOrMore } from "../../../helpers/validation";
import { Input } from "../../Input";

const INITIAL_STATE = {
  level: { value: "", error: "" },
  numOfGrps: { value: "", error: "" },
  modules: { value: [] },
  modInput: { value: "" },
  desc: { value: "", error: "" },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "LEVEL":
      return { ...state, level: { value: action.payload, error: "" } };
    case "NUM_GRP":
      return {
        ...state,
        numOfGrps: {
          value: action.payload < 0 ? 0 : action.payload,
          error: "",
        },
      };
    case "MOD":
      return {
        ...state,
        modules: { value: [...state.modules.value, action.payload], error: "" },
      };
    case "MOD_INPUT":
      return {
        ...state,
        modInput: {
          value: action.payload,
          error: "",
        },
      };
    case "DESC":
      var error =
        isStrEmpty(action.payload) || treeCharsOrMore(action.payload)
          ? ""
          : "description must be at least tree characters long!";
      return { ...state, desc: { value: action.payload, error } };
    case "ADD_MOD":
      return {
        ...state,
        modules: {
          value: [...state.modules.value, action.payload],
          error: "",
        },
      };
    case "RM_MOD":
      return {
        ...state,
        modules: {
          value: state.modules.value.filter(
            (m: string) => m !== action.payload
          ),
          error: "",
        },
      };
    default:
      return state;
  }
};

const AddLevel = () => {
  const { model, setModel, setAlert, labelsData, setLabelsData } =
    useGlobalContext();
  const { addLevel, updateLevel } = useSettings();
  const [state, dispatch] = React.useReducer(
    reducer,
    model.type === "ADD_LEVEL"
      ? INITIAL_STATE
      : {
          level: { value: model.level.value, error: "" },
          numOfGrps: { value: model.level.numberOfGrps, error: "" },
          modules: { value: model.level.modules },
          desc: { value: model.level.desc, error: "" },
          modInput: { value: "" },
        }
  );

  // Modules box handle.
  const enterKeyPressHandler = (e: any) => {
    const value = state.modInput.value.trim();
    if (e.key !== "Enter" || !value) return;
    const newModules = state.modules.value.filter((m: string) => m !== value);
    if (state.modules.value.includes(value)) {
      return setAlert({
        type: "warn",
        message: `Module "${value} is already in the list"`,
      });
    }
    dispatch({ type: "ADD_MOD", payload: value });
    dispatch({ type: "MOD_INPUT", payload: "" });
  };

  const submitHandler = () => {
    // Check if event not empty and contains 1 char or more.
    if (isStrEmpty(state.level.value)) {
      return setAlert({
        type: "warn",
        message: `Level is required, it must be a least one character or more.`,
      });
    }
    // Check if the number of groups is not zero.
    else if (state.numOfGrps.value <= 0)
      return setAlert({
        type: "warn",
        message: "the number of groups shouldn't be zero.",
      });
    // Check if there is at least one module.
    else if (state.modules.value.length === 0)
      return setAlert({
        type: "warn",
        message: "it has to be at least one module.",
      });
    // Check if other conditions are met.
    else if (state.desc.error)
      return setAlert({
        type: "warn",
        message: state.desc.error,
      });
    // Check for errors or success.
    const res =
      model.type === "ADD_LEVEL"
        ? addLevel(
            labelsData,
            state.level.value,
            state.numOfGrps.value,
            state.modules.value,
            state.desc.value
          )
        : updateLevel(
            labelsData,
            model.level,
            state.level.value,
            state.numOfGrps.value,
            state.modules.value,
            state.desc.value
          );
    if (res) {
      setLabelsData(res);
      model.setSaved(false);
      setModel(null);
    } else {
      setAlert({
        type: "warn",
        message: `level "${state.level.value}" already exists!`,
      });
      dispatch({ type: "LEVEL", payload: "" });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-xl text-center text-primary">
          {model.type === "ADD_LEVEL" ? "Add New Level" : "Update Level"}
        </div>
        <div className="flex flex-col items-center gap-3">
          <Input
            type="text"
            label="level"
            placeholder="Level..."
            required={true}
            value={state.level.value}
            onChange={(e) =>
              dispatch({ type: "LEVEL", payload: e.target.value.toUpperCase() })
            }
          />
          <Input
            type="number"
            label="number of groups"
            placeholder="0"
            required={true}
            value={state.numOfGrps.value}
            onChange={(e) =>
              dispatch({ type: "NUM_GRP", payload: e.target.value })
            }
          />
          <div className="textbox">
            <span className="py-0.5">Modules: </span>
            {state.modules.value.map((mod: string) => (
              <div className="max-h-[1.75rem]" key={mod}>
                {mod}
                <IcEx
                  onClick={(e) => dispatch({ type: "RM_MOD", payload: mod })}
                  className="textbox-icon"
                />
              </div>
            ))}
            <input
              type="text"
              value={state.modInput.value}
              onChange={(e) =>
                dispatch({
                  type: "MOD_INPUT",
                  payload: e.target.value.toLocaleUpperCase(),
                })
              }
              placeholder="type here..."
              onKeyPress={enterKeyPressHandler}
            />
          </div>
          <Input
            type="textarea"
            label="description"
            placeholder="description..."
            value={state.desc.value}
            error={state.desc.error}
            onChange={(e) =>
              dispatch({ type: "DESC", payload: e.target.value })
            }
          />
        </div>
        <div className="model-btn-container">
          <Button
            text={model.type === "ADD_Level" ? "Add" : "Update"}
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
    </>
  );
};

export default AddLevel;

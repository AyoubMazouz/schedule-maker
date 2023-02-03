import React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../Contexts/AuthContext";
import { IcNewDoc, IcNotAllowed, IcSave } from "../../helpers/icons";
import { useUser } from "../../hooks/useUser";
import { treeCharsOrMore } from "../../helpers/validation";

const reducer = (state, action) => {
  switch (action.type) {
    case "IMG":
      return state;
    case "PHONE":
      var v = "";
      return {
        ...state,
        saved: false,
        phone: { value: action.payload, error: "" },
      };
    case "ORG":
      var v = treeCharsOrMore(action.payload);
      var error = v ? "" : "org must be tree characters or more.";
      return {
        ...state,
        saved: false,
        org: { value: action.payload, error },
      };
    case "SAVE":
      return { ...state, saved: true };
    case "DISCARD":
      return {
        saved: true,
        img: "",
        phone: { value: action.payload.phone, error: "" },
        org: { value: action.payload.org, error: "" },
      };
    default:
      return state;
  }
};

export const Profile = () => {
  const { currUser, loading } = useAuth();
  const { updateUserDoc } = useUser();

  const INITIAL_STATE = {
    phone: { value: currUser.phone, error: "" },
    org: { value: currUser.org, error: "" },
    img: "",
    saved: true,
  };
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  const handleSave = async () => {
    const document = {
      ...currUser,
      phone: state.phone.value,
      org: state.org.value,
    };
    const res = await updateUserDoc(document);
    if (res === "success") dispatch({ type: "SAVE" });
  };

  return (
    <div className="p-2 space-y-3">
      <div className="flex justify-between">
        <div className="group relative w-[6rem] overflow-hidden rounded-md shadow-md">
          <img src={currUser.img} className="aspect-square" />
          <IcNewDoc className="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] text-4xl text-primary transition-all duration-300 group-hover:opacity-50" />
          <input
            type="file"
            accept="jpg,jpeg,png"
            onChange={(e) => dispatch({ type: "IMG" })}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex gap-x-3">
          <Button
            text="discard"
            Icon={IcNotAllowed}
            onClick={(e) => dispatch({ type: "DISCARD" })}
            disabled={loading || state.saved}
          />
          <Button
            text="save"
            type="success"
            Icon={IcSave}
            onClick={handleSave}
            disabled={loading || state.saved}
          />
        </div>
      </div>
      <Input
        type="tel"
        label="phone number"
        placeholder="Phone Number..."
        value={state.phone.value}
        onChange={(e) => dispatch({ type: "PHONE", payload: e.target.value })}
      />
      <Input
        type="text"
        label="organization"
        placeholder="Your Organization..."
        value={state.org.value}
        error={state.org.error}
        onChange={(e) => dispatch({ type: "ORG", payload: e.target.value })}
      />
    </div>
  );
};

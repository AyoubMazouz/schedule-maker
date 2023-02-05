import React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../Contexts/AuthContext";
import { IcEdit, IcNotAllowed, IcSave } from "../../helpers/icons";
import { useUser } from "../../hooks/useUser";
import { treeCharsOrMore } from "../../helpers/validation";
import useSettings from "../../hooks/useSettings";
import { BANNER_SIZE, PROFILE_IMG_SIZE } from "../../helpers/constants";

const reducer = (state, action) => {
  switch (action.type) {
    case "IMG":
      return {
        ...state,
        saved: false,
        img: action.payload,
      };
    case "BANNER":
      return {
        ...state,
        saved: false,
        banner: action.payload,
      };
    case "PHONE":
      return {
        ...state,
        saved: false,
        phone: { value: action.payload, error: "" },
      };
    case "ORG":
      return {
        ...state,
        saved: false,
        org: {
          value: action.payload,
          error: treeCharsOrMore(action.payload)
            ? ""
            : "org must be tree characters or more.",
        },
      };
    case "SAVE":
      return { ...state, saved: true };
    case "DISCARD":
      return {
        saved: true,
        img: action.payload.img,
        banner: action.payload.banner,
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
  const { resizeImg } = useSettings();

  const INITIAL_STATE = {
    phone: { value: currUser.phone, error: "" },
    org: { value: currUser.org, error: "" },
    img: currUser.img,
    banner: currUser.banner,
    saved: true,
  };
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  const handleImg = async (e) =>
    await resizeImg(e.target.files[0], PROFILE_IMG_SIZE, (uri) =>
      dispatch({ type: "IMG", payload: uri })
    );
  const handleBanner = async (e) =>
    await resizeImg(e.target.files[0], BANNER_SIZE, (uri) =>
      dispatch({ type: "BANNER", payload: uri })
    );

  const handleSave = async () => {
    const document = {
      ...currUser,
      phone: state.phone.value,
      org: state.org.value,
      img: state.img,
      banner: state.banner,
    };
    const res = await updateUserDoc(document);
    if (res === "success") dispatch({ type: "SAVE" });
  };

  return (
    <div className="p-2">
      <div
        style={{ backgroundImage: `url(${state.banner})` }}
        className="relative -m-2 flex h-[10rem] justify-between bg-cover shadow-md"
      >
        <div className="absolute bottom-[0%] left-[5%] translate-y-[15%] overflow-hidden rounded-full border-[6px] border-light shadow-lg">
          <div className="group relative h-[6rem] w-[6rem] transition-all duration-700 hover:scale-110">
            <img src={state.img} className="object-cover h-full" />
            <div className="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] rounded-full bg-light p-1.5 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-50">
              <IcEdit className="text-2xl text-emerald-600" />
            </div>
            <input
              type="file"
              accept="jpg,jpeg,png"
              onChange={handleImg}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col p-2 ml-auto gap-y-3">
          <Button
            text="save"
            type="success"
            Icon={IcSave}
            onClick={handleSave}
            disabled={loading || state.saved}
            styles="justify-center"
          />
          <Button
            type="warn"
            text="discard"
            Icon={IcNotAllowed}
            disabled={loading || state.saved}
            onClick={(e) => dispatch({ type: "DISCARD", payload: currUser })}
          />
          <Button
            text="edit"
            Icon={IcEdit}
            styles="text-light border-light justify-center mt-auto"
          >
            <input
              type="file"
              accept="jpg,jpeg,png"
              onChange={handleBanner}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>
      <div className="mt-8">
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
    </div>
  );
};

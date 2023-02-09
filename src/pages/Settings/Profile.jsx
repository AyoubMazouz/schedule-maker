import React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../Contexts/AuthContext";
import {
  IcAddress,
  IcCopied,
  IcDesc,
  IcEdit,
  IcNotAllowed,
  IcOrg,
  IcSave,
} from "../../helpers/icons";
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
    case "DESC":
      return {
        ...state,
        saved: false,
        desc: {
          value: action.payload,
          error: treeCharsOrMore(action.payload)
            ? ""
            : "description must be tree characters or more.",
        },
      };
    case "ADDRESS":
      return {
        ...state,
        saved: false,
        address: {
          value: action.payload,
          error: treeCharsOrMore(action.payload)
            ? ""
            : "address must be tree characters or more.",
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
    desc: currUser.desc,
    address: currUser.address,
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
      desc: state.desc,
      desc: state.address,
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
        <div className="absolute bottom-[0%] left-[5%] flex translate-y-[75%] items-center gap-x-3 p-2">
          <div className="overflow-hidden rounded-full border-[6px] border-light shadow-lg">
            <div className="group relative h-[6rem] w-[6rem] transition-all duration-700 hover:scale-110">
              <img src={state.img} className="h-full object-cover" />
              <div className="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] rounded-full bg-light p-1.5 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-50">
                <IcEdit className="text-2xl text-emerald-600" />
              </div>
              <input
                type="file"
                accept="jpg,jpeg,png"
                onChange={handleImg}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>
          <div className="-space-y-1">
            <div className="text-lg font-semibold text-primary">
              @{currUser.username}
            </div>
            <div className="underline">{currUser.email}</div>
          </div>
        </div>
        <Button text="edit" type="secondary" Icon={IcEdit} styles="ml-auto m-2">
          <input
            type="file"
            accept="jpg,jpeg,png"
            onChange={handleBanner}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <Button
          type="warn"
          text="discard"
          Icon={IcNotAllowed}
          disabled={loading || state.saved}
          onClick={(e) => dispatch({ type: "DISCARD", payload: currUser })}
        />
        <Button
          text="save"
          type="success"
          Icon={IcSave}
          onClick={handleSave}
          disabled={loading || state.saved}
          styles="justify-center"
        />
      </div>
      <div className="mt-24">
        <Input
          type="tel"
          label="phone number"
          Icon={IcCopied}
          placeholder="Phone Number..."
          value={state.phone.value}
          onChange={(e) => dispatch({ type: "PHONE", payload: e.target.value })}
        />
        <Input
          type="text"
          label="organization"
          placeholder="Your Organization..."
          Icon={IcOrg}
          value={state.org.value}
          error={state.org.error}
          onChange={(e) => dispatch({ type: "ORG", payload: e.target.value })}
        />
        <Input
          type="text"
          label="address"
          placeholder="Address..."
          Icon={IcAddress}
          value={state.address.value}
          error={state.address.error}
          onChange={(e) =>
            dispatch({ type: "ADDRESS", payload: e.target.value })
          }
        />
        <Input
          type="textarea"
          label="description"
          placeholder="Description..."
          Icon={IcDesc}
          value={state.desc.value}
          error={state.desc.error}
          onChange={(e) => dispatch({ type: "DESC", payload: e.target.value })}
        />
      </div>
    </div>
  );
};

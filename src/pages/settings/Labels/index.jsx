import React from "react";
import SettingsLayout from "../../Editor/SettingsLayout";
import { useAuth } from "../../../Contexts/AuthContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import Events from "./Events";
import Levels from "./Levels";
import OptionBar from "./OptionBar";
import Rooms from "./Rooms";
import Trainers from "./Trainers";
import usePageTitle from "../../../hooks/usePageTitle";

const Labels = () => {
usePageTitle("Labels")

  const { setAlert, labelsData, loadLabelsData } = useGlobalContext();
  const { currUser } = useAuth();
  const menuRef = React.useRef(null);
  const [currMenu, setCurrMenu] = React.useState(null);

  const [saved, setSaved] = React.useState(true);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setCurrMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  React.useEffect(() => {
    loadLabelsData(currUser.username);
  }, []);

  React.useEffect(() => {
    if (saved) window.onbeforeunload = null;
    else
      window.onbeforeunload = () => {
        const message =
          "You can't leave this page with unsaved changes, if you leave changes will be lost.";
        setAlert({
          type: "warn",
          message,
        });
        return message;
      };
  }, [saved]);

  return (
    <SettingsLayout {...{ saved }}>
      <div className="p-2 space-y-2">
        <OptionBar
          {...{
            menuRef,
            currMenu,
            setCurrMenu,
            saved,
            setSaved,
          }}
        />
        <div>levels:</div>
        <Levels
          {...{
            currMenu,
            setCurrMenu,
            menuRef,
            setSaved,
            labelsData,
          }}
        />
        <div>Rooms:</div>
        <Rooms
          {...{
            currMenu,
            setCurrMenu,
            menuRef,
            setSaved,
          }}
        />
        <div>Trainers:</div>
        <Trainers
          {...{
            currMenu,
            setCurrMenu,
            menuRef,
            setSaved,
          }}
        />
        <div>Events:</div>
        <Events
          {...{
            currMenu,
            setCurrMenu,
            menuRef,
            setSaved,
          }}
        />
      </div>
    </SettingsLayout>
  );
};

export default Labels;

import React from "react";
import { Button } from "../../../components/Button";
import { DropdownMenu } from "../../../components/DropdownMenu";
import {
  IcBin,
  IcDown,
  IcEvent,
  IcExport,
  IcImport,
  IcLevel,
  IcNewDoc,
  IcRoom,
  IcSave,
  IcUser,
} from "../../../helpers/icons";
import { useAuth } from "../../../Contexts/AuthContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useLabels from "../../../hooks/useLabels";
import useSettings from "../../../hooks/useSettings";

const OptionBar = ({ menuRef, currMenu, setCurrMenu, saved, setSaved }) => {
  const { setModel, labelsData, setLabelsData } = useGlobalContext();
  const { currUser } = useAuth();
  const { getLabels, setLabels } = useLabels();
  const { importSettings, exportSettings } = useSettings();

  const discardChanges = () => {
    getLabels().then((data) => {
      setLabelsData(data);
    });
    setSaved(true);
  };

  const addLevelHandler = () =>
    setModel({
      type: "ADD_LEVEL",
      setSaved,
    });
  const addTrainerHandler = () =>
    setModel({
      type: "ADD_TRAINER",
      setSaved,
    });
  const addRoomHandler = () =>
    setModel({
      type: "ADD_ROOM",
      setSaved,
    });
  const addEventHandler = () =>
    setModel({
      type: "ADD_EVENT",
      setSaved,
    });

  const SaveMenuItem = () => (
    <button
      disabled={saved}
      className={`menu-item relative ${
        !saved &&
        "after:absolute after:top-[38%] after:left-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
      }`}
      onClick={(e) => {
        setLabels(currUser.username, labelsData);
        setSaved(true);
      }}
    >
      <IcSave className="icon" />
      <span>Save</span>
    </button>
  );
  const ImportMenuItem = () => (
    <div className="relative overflow-hidden menu-item">
      <input
        type="file"
        accept=".json,.xls,.xlsm"
        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          importSettings(e.target.files[0], setLabelsData);
          setSaved(false);
        }}
      />
      <IcImport className="icon" />
      <span>Import</span>
    </div>
  );

  return (
    <div className="relative flex gap-6 p-2 border rounded-lg shadow-md">
      <DropdownMenu
        text="file"
        menuRef={menuRef}
        currMenu={currMenu}
        setCurrMenu={setCurrMenu}
        options={[
          <SaveMenuItem />,
          ["discard", discardChanges, IcBin, saved],
          <ImportMenuItem />,
          ["Export as JSON", () => exportSettings(labelsData), IcExport],
        ]}
      />
      <DropdownMenu
        text="add"
        menuRef={menuRef}
        currMenu={currMenu}
        setCurrMenu={setCurrMenu}
        options={[
          ["New Level", addLevelHandler, IcLevel],
          ["New Room", addRoomHandler, IcRoom],
          ["New Trainer", addTrainerHandler, IcUser],
          ["New Event", addEventHandler, IcEvent],
        ]}
      />
    </div>
  );
};

export default OptionBar;

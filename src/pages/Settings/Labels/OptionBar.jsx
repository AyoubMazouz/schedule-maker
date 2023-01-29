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

const OptionBar = ({
  menuRef,
  currMenu,
  setCurrMenu,
  saved,
  setSaved,
  labelsData,
  setLabelsData,
}) => {
  const { setModel } = useGlobalContext();
  const { currUser } = useAuth();
  const { getLabels, setLabels } = useLabels();
  const { importSettings, exportSettings } = useSettings();

  const discardChanges = () => {
    getLabels().then((data) => {
      setLabelsData(data);
    });
    setSaved(true);
  };

  const addLevelHandler = () => {
    setModel({
      type: "addLevel",
      labelsData,
      setLabelsData,
      setSaved,
    });
  };
  const addTrainerHandler = () => {
    setModel({
      type: "addTrainer",
      labelsData,
      setLabelsData,
      setSaved,
    });
  };
  const addRoomHandler = () => {
    setModel({
      type: "addRoom",
      setSaved,
    });
  };
  const addEventHandler = () => {
    setModel({
      type: "addEvent",
      labelsData,
      setLabelsData,
      setSaved,
    });
  };
  const SaveMenuItem = () => (
    <button
      disabled={saved}
      className={`menu-item relative ${
        !saved &&
        "after:absolute after:top-[38%] after:left-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
      }`}
      onClick={(e) => {
        setLabels(currUser.uid, labelsData);
        setSaved(true);
      }}
    >
      <IcSave className="icon" />
      <span>Save</span>
    </button>
  );
  const ImportMenuItem = () => (
    <div className="menu-item relative overflow-hidden">
      <input
        type="file"
        accept=".json,.xls,.xlsm"
        className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer opacity-0"
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
    <div className="relative flex gap-6 rounded-lg border p-2 shadow-md">
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
          ["New Trainer", addTrainerHandler, IcUser],
          ["New Room", addRoomHandler, IcRoom],
          ["New Event", addEventHandler, IcEvent],
        ]}
      />
      <div className="flex gap-x-6">
        {/* <div className="relative overflow-hidden btn">
                    <input
                        type="file"
                        accept=".json,.xls,.xlsm"
                        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                        onChange={(e) =>
                            importSettings(e.target.files[0], setLabelsData)
                        }
                        />
                        <IcImport className="icon" />
                    <span>Import</span>
                </div>
                <button
                    className="btn-success"
                    onClick={(e) =>
                        exportSettings(labelsData, "settings.sh-maker")
                    }
                    >
                    <IcExport className="icon" />
                    <span>Export</span>
                </button> */}
      </div>
    </div>
  );
};

export default OptionBar;

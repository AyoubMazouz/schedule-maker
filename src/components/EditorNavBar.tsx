import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { DAYS_TEXT, SESSIONS_TEXT } from "../helpers/constants";
import useEditor from "../hooks/useEditor";
import { useEditorContext } from "../Contexts/EditorContext";
import useDocument from "../hooks/useDocument";
import { Select } from "./Select";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "./Button";
import { usePdf } from "../hooks/usePdf";
import { useAuth } from "../Contexts/AuthContext";
import {
  IcBin,
  IcExport,
  IcFusion,
  IcImport,
  IcLogout,
  IcNewDoc,
  IcSave,
} from "../helpers/icons";

const OptionBar = () => {
  const { saved, setSaved, setFusionMode, fusionMode, selectedCell } =
    useEditorContext();
  const { data, setData, setModel, setAlert, labelsData, loadLabelsData } =
    useGlobalContext();
  const {
    importDocument,
    exportDocument,
    clearCell,
    editField,
    getModules,
    getTrainers,
    getRooms,
    getEvents,
  } = useEditor();
  const { addNewDocument } = useDocument();
  const { exportAsPdf } = usePdf();
  const { currUser } = useAuth();

  const { docId } = useParams();
  const navigate = useNavigate();

  const menuRef = React.useRef<HTMLDivElement>(null);
  const [currMenu, setCurrMenu] = React.useState<string | null>(null);

  const [availableTrainers, setAvailableTrainers] = React.useState<string[]>(
    []
  );
  const [unavailableTrainers, setUnavailableTrainers] = React.useState<
    string[]
  >([]);
  const [preferredRooms, setPreferredRooms] = React.useState<string[]>([]);
  const [unavailableRooms, setUnavailableRooms] = React.useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = React.useState<string[]>([]);
  const [modules, setModules] = React.useState<string[]>([]);
  const [events, setEvents] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadLabelsData(currUser.uid);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setCurrMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  React.useEffect(() => {
    if (selectedCell) {
      // Get modules depending on current group.
      const modules = getModules(data, labelsData, selectedCell);
      setModules(modules);

      // Get Events.
      const events = getEvents(labelsData);
      setEvents(events);

      // Get Trainers.
      const [availableTrainers, unavailableTrainers] = getTrainers(
        data,
        labelsData,
        selectedCell
      );
      setUnavailableTrainers(unavailableTrainers);
      setAvailableTrainers(availableTrainers);

      // Get Rooms.
      const [preferredRooms, availableRooms, unavailableRooms] = getRooms(
        data,
        labelsData,
        selectedCell
      );
      setPreferredRooms(preferredRooms);
      setAvailableRooms(availableRooms);
      setUnavailableRooms(unavailableRooms);
    }
  }, [selectedCell, data]);

  const exitHandler = async () => {
    if (saved) navigate("/documents");
    else setModel({ type: "exit" });
    setCurrMenu(null);
  };

  const downloadHandler = () => {
    exportAsPdf(data, docId as string);
    setAlert({ type: "success", message: "Download has started..." });
    setCurrMenu(null);
  };

  const exportHandler = () => {
    exportDocument(data, docId as string);
    setCurrMenu(null);
  };
  const newDocHandler = () => {
    setModel({ type: "newdoc" });
  };

  const clearCellHandler = () => {
    const [schedualIndex, dayIndex, sessionIndex] = selectedCell;
    const res = clearCell(
      data,
      setData,
      fusionMode,
      schedualIndex,
      dayIndex,
      sessionIndex
    );
    if (res) setSaved(false);
  };

  const editFieldHandler = (row: number, value: string) => {
    const [schedualIndex, dayIndex, sessionIndex] = selectedCell;
    const res = editField(
      data,
      setData,
      fusionMode,
      schedualIndex,
      dayIndex,
      sessionIndex,
      row,
      value
    );
    const sessionTextSplited = SESSIONS_TEXT[sessionIndex].split("-");
    let message;
    if (res) {
      setSaved(false);
    } else {
      if (row === 0) {
        message = `The professor "${value}" is not available on "${DAYS_TEXT[dayIndex]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" working with the group "${data[schedualIndex].group}" in classRoom number "${value}".`;
      } else if (row === 2) {
        message = `The Room number "${value}" is not available on "${DAYS_TEXT[dayIndex]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" it is ocupied by the group "${value}".`;
      }
      setAlert({ type: "warn", message });
    }
  };

  const SaveMenuItem = () => (
    <button
      disabled={saved}
      className={`menu-item relative ${
        !saved &&
        "after:absolute after:top-[38%] after:left-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
      }`}
      onClick={async () => {
        setCurrMenu(null);
        await addNewDocument(currUser.uid, docId as string, data);
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
        onChange={(e: any) => {
          importDocument(e.target.files[0], setData);
          setSaved(false);
        }}
      />
      <IcImport className="icon" />
      <span>Import</span>
    </div>
  );

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between w-full p-2 gap-x-2">
      <DropdownMenu
        text="file"
        menuRef={menuRef}
        currMenu={currMenu}
        setCurrMenu={setCurrMenu}
        options={[
          <SaveMenuItem />,
          ["new", newDocHandler, IcNewDoc, false],
          <ImportMenuItem />,
          ["Export as Json", exportHandler, IcExport, false],
          ["Export as pdf", downloadHandler, IcExport, false],
          ["exit", exitHandler, IcLogout, false],
        ]}
      />
      <div className="flex gap-x-2">
        <Button
          label={["Fusion Mode", "Let's you fill two fields at once."]}
          Icon={IcFusion}
          onClick={() => setFusionMode((x: boolean) => !x)}
          trigger={fusionMode}
        />
      </div>
      {selectedCell ? (
        <div className="flex items-center gap-x-2">
          <Button Icon={IcBin} label={["clear"]} onClick={clearCellHandler} />
          <Select
            label="trainers"
            notRecommended={unavailableTrainers}
            values={availableTrainers}
            value={
              data[selectedCell[0]].schedual[selectedCell[1]][
                selectedCell[2]
              ][0]
            }
            onChange={(e: any) => editFieldHandler(0, e.target.value)}
          />
          <Select
            label="modules"
            values={modules}
            value={
              data[selectedCell[0]].schedual[selectedCell[1]][
                selectedCell[2]
              ][1]
            }
            onChange={(e: any) => editFieldHandler(1, e.target.value)}
          />
          <Select
            label="rooms"
            values={availableRooms}
            recommended={preferredRooms}
            notRecommended={unavailableRooms}
            value={
              data[selectedCell[0]].schedual[selectedCell[1]][
                selectedCell[2]
              ][2]
            }
            onChange={(e: any) => editFieldHandler(2, e.target.value)}
          />
          <Select
            label="events"
            values={events}
            value={
              data[selectedCell[0]].schedual[selectedCell[1]][
                selectedCell[2]
              ][3]
            }
            onChange={(e: any) => editFieldHandler(3, e.target.value)}
          />
          <div className="text-xs leading-3">
            <div>
              <span>x:</span>
              <span className="font-semibold text-primary">
                {selectedCell[0]}
              </span>
            </div>
            <div>
              <span>y:</span>
              <span className="font-semibold text-primary">
                {selectedCell[1]}
              </span>
            </div>
            <div>
              <span>z:</span>
              <span className="font-semibold text-primary">
                {selectedCell[2]}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default OptionBar;
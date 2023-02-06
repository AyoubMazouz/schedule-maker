import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { DAYS_TEXT, SESSIONS_TEXT } from "../../helpers/constants";
import useEditor from "../../hooks/useEditor";
import { useEditorContext } from "../../Contexts/EditorContext";
import useDocument from "../../hooks/useDocument";
import { Select } from "../../components/Select";
import { DropdownMenu } from "../../components/DropdownMenu";
import { Button } from "../../components/Button";
import { usePdf } from "../../hooks/usePdf";
import { useAuth } from "../../Contexts/AuthContext";
import {
  IcBin,
  IcExport,
  IcFusion,
  IcImport,
  IcLogout,
  IcNewDoc,
  IcRedo,
  IcSave,
  IcSelectionNone,
  IcSettings,
  IcUndo,
} from "../../helpers/icons";

const OptionBar = () => {
  const { data, setData, setModel, setAlert, labelsData, loadLabelsData } =
    useGlobalContext();
  const {
    saved,
    setSaved,
    setFusionMode,
    fusionMode,
    selectedCell,
    setSelectedCell,
    history,
    hIndex,
    setHistory,
    setHIndex,
  } = useEditorContext();
  const {
    importDocument,
    exportDocument,
    clearCell,
    editField,
    getModules,
    getTrainers,
    getRooms,
    getEvents,
    record,
    undo,
    redo,
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
    loadLabelsData(currUser.username);
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
    else setModel({ type: "exit", to: "/documents" });
    setCurrMenu(null);
  };
  const goToSettingsHandler = async () => {
    if (saved) navigate("/settings/labels");
    else setModel({ type: "exit", to: "/settings/labels" });
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
    const [scheduleIndex, dayIndex, sessionIndex] = selectedCell;
    const res = clearCell(
      data,
      setData,
      fusionMode,
      scheduleIndex,
      dayIndex,
      sessionIndex
    );
    if (res) setSaved(false);
  };

  const editFieldHandler = (row: number, value: string) => {
    const [x, y, z] = selectedCell;

    // Record for undo and redo.
    record(
      history,
      hIndex,
      setHistory,
      setHIndex,
      x,
      y,
      z,
      row,
      value,
      data[x].schedule[y][z][row]
    );

    const res = editField(data, setData, fusionMode, x, y, z, row, value);
    const sessionTextSplited = SESSIONS_TEXT[z].split("-");
    let message;
    if (res) {
      setSaved(false);
    } else {
      if (row === 0) {
        message = `The professor "${value}" is not available on "${DAYS_TEXT[y]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" working with the group "${data[x].group}" in classRoom number "${value}".`;
      } else if (row === 2) {
        message = `The Room number "${value}" is not available on "${DAYS_TEXT[y]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" it is ocupied by the group "${value}".`;
      }
      setAlert({ type: "warn", message });
    }
  };

  const handleUndo = () => {
    undo(data, setData, history, hIndex, setHistory, setHIndex, fusionMode);
    setSaved(false);
  };

  const handleRedo = () => {
    redo(data, setData, history, hIndex, setHistory, setHIndex, fusionMode);
    setSaved(false);
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
        await addNewDocument(currUser.username, docId as string, data);
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
          ["Settings", goToSettingsHandler, IcSettings, false],
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
        <Button
          label={["Undo"]}
          Icon={IcUndo}
          onClick={handleUndo}
          disabled={hIndex === 0}
        />
        <Button
          label={["Redo"]}
          Icon={IcRedo}
          onClick={handleRedo}
          disabled={hIndex === history.length}
        />
      </div>
      {selectedCell ? (
        <div className="flex items-center gap-x-2">
          <Button
            label={["Select None"]}
            Icon={IcSelectionNone}
            onClick={() => setSelectedCell(null)}
          />
          <Button Icon={IcBin} label={["clear"]} onClick={clearCellHandler} />
          <Select
            label="trainers"
            notRecommended={unavailableTrainers}
            values={availableTrainers}
            value={
              data[selectedCell[0]].schedule[selectedCell[1]][
                selectedCell[2]
              ][0]
            }
            onChange={(e: any) => editFieldHandler(0, e.target.value)}
          />
          <Select
            label="modules"
            values={modules}
            value={
              data[selectedCell[0]].schedule[selectedCell[1]][
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
              data[selectedCell[0]].schedule[selectedCell[1]][
                selectedCell[2]
              ][2]
            }
            onChange={(e: any) => editFieldHandler(2, e.target.value)}
          />
          <Select
            label="events"
            values={events}
            value={
              data[selectedCell[0]].schedule[selectedCell[1]][
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
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

const EditorOptionBar = () => {
  const {
    data,
    setData,
    setModel,
    setAlert,
    labelsData,
    loadLabelsData,
    docInfo,
  } = useGlobalContext();
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
    menuRef,
    currMenu,
    setCurrMenu,
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
  const { updateDocument } = useDocument();
  const { exportAsPdf } = usePdf();
  const { currUser } = useAuth();

  const { docId } = useParams();
  const navigate = useNavigate();

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
    setAlert("success", "Download has started...");
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
      setAlert("warn", message);
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
        await updateDocument(data, docInfo);
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
    <div className="sticky top-0 z-30 col-span-full flex h-12 justify-between gap-x-2 border-b-2 border-dark/50 px-2 shadow-lg md:px-6 lg:px-12">
      <DropdownMenu
        text="file"
        menuRef={menuRef}
        currMenu={currMenu}
        setCurrMenu={setCurrMenu}
        styles="h-full"
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
      <div className="flex h-full items-center">
        <Button
          label={["Fusion Mode", "Let's you fill two fields at once."]}
          Icon={IcFusion}
          onClick={() => setFusionMode((x: boolean) => !x)}
          trigger={fusionMode}
          styles="w-12 h-full rounded-none"
        />
        <Button
          label={["Undo"]}
          Icon={IcUndo}
          onClick={handleUndo}
          disabled={hIndex === 0}
          styles="w-12 h-full rounded-none"
        />
        <Button
          label={["Redo"]}
          Icon={IcRedo}
          onClick={handleRedo}
          disabled={hIndex === history.length}
          styles="w-12 h-full rounded-none"
        />
        <Button
          label={["Select None"]}
          Icon={IcSelectionNone}
          onClick={() => setSelectedCell(null)}
          disabled={!selectedCell}
          styles="w-12 h-full rounded-none"
        />
        <Button
          Icon={IcBin}
          label={["clear"]}
          onClick={clearCellHandler}
          styles="w-12 h-full rounded-none"
          disabled={!selectedCell}
        />

        {selectedCell ? (
          <>
            <Select
              label="trainers"
              notRecommended={unavailableTrainers}
              values={availableTrainers}
              value={
                data[selectedCell[0]].schedule[selectedCell[1]][
                  selectedCell[2]
                ][0]
              }
              onChange={(v: string) => editFieldHandler(0, v)}
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
              styles="h-full border-none shadow-none rounded-none"
            />
            <Select
              label="modules"
              values={modules}
              value={
                data[selectedCell[0]].schedule[selectedCell[1]][
                  selectedCell[2]
                ][1]
              }
              onChange={(v: string) => editFieldHandler(1, v)}
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
              styles="h-full border-none shadow-none rounded-none"
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
              onChange={(v: string) => editFieldHandler(2, v)}
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
              styles="h-full border-none shadow-none rounded-none"
            />
            <Select
              label="events"
              values={events}
              value={
                data[selectedCell[0]].schedule[selectedCell[1]][
                  selectedCell[2]
                ][3]
              }
              onChange={(v: string) => editFieldHandler(3, v)}
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
              styles="h-full border-none shadow-none rounded-none"
            />
            <div className="mx-2 text-xs font-semibold leading-3">
              <div>{`x: ${selectedCell[0]}`}</div>
              <div>{`y: ${selectedCell[1]}`}</div>
              <div>{`z: ${selectedCell[2]}`}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EditorOptionBar;

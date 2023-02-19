import React from "react";
// Contexts.
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { useEditorContext } from "../../../Contexts/EditorContext";
// Hooks.
import useEditorNavBar from "./useEditorNavBar";
// Components.
import { Select } from "../../../components/Select";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { Button } from "../../../components/Button";
import {
  IcBin,
  IcCopy,
  IcExport,
  IcFusion,
  IcImport,
  IcLogout,
  IcNewDoc,
  IcPaste,
  IcRedo,
  IcSave,
  IcSelectionNone,
  IcSettings,
  IcUndo,
} from "../../../helpers/icons";

const EditorNavBar = () => {
  const {
    saved,
    setFusionMode,
    fusionMode,
    selectedCell,
    setSelectedCell,
    history,
    hIndex,
    menuRef,
    currMenu,
    setCurrMenu,
    clipboard,
  } = useEditorContext();
  const { data } = useGlobalContext();
  const {
    availableTrainers,
    unavailableTrainers,
    preferredRooms,
    unavailableRooms,
    availableRooms,
    modules,
    events,
    handleExit,
    handleGoToSettings,
    handleDownload,
    handleExport,
    handleNewDoc,
    handleClearCell,
    editFieldHandler,
    handleUndo,
    handleRedo,
    handleCopy,
    handlePaste,
    handleSave,
    handleImport,
  } = useEditorNavBar();

  const SaveMenuItem = () => (
    <button
      disabled={saved}
      className={`menu-item relative ${
        !saved &&
        "after:absolute after:top-[38%] after:left-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
      }`}
      onClick={handleSave}
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
        onChange={handleImport}
      />
      <IcImport className="icon" />
      <span>Import</span>
    </div>
  );

  return (
    <div className="sticky top-0 z-30 col-span-full flex h-12 justify-between gap-x-2 border-b-[1px] border-dark/50 shadow-lg">
      <div className="flex h-full items-center">
        <DropdownMenu
          text="file"
          menuRef={menuRef}
          currMenu={currMenu}
          setCurrMenu={setCurrMenu}
          styles="h-full"
          options={[
            <SaveMenuItem />,
            ["new", handleNewDoc, IcNewDoc, false],
            <ImportMenuItem />,
            ["Export as Json", handleExport, IcExport, false],
            ["Export as pdf", handleDownload, IcExport, false],
            ["Settings", handleGoToSettings, IcSettings, false],
            ["exit", handleExit, IcLogout, false],
          ]}
        />
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
          disabled={hIndex === -1}
          styles="w-12 h-full rounded-none"
        />
        <Button
          label={["Redo"]}
          Icon={IcRedo}
          onClick={handleRedo}
          disabled={hIndex === history.length - 1}
          styles="w-12 h-full rounded-none"
        />
        <Button
          label={["Copy"]}
          Icon={IcCopy}
          onClick={handleCopy}
          disabled={!selectedCell}
          styles="w-12 h-full rounded-none"
        />
        <Button
          label={["Paste"]}
          Icon={IcPaste}
          onClick={handlePaste}
          disabled={!clipboard}
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
          onClick={handleClearCell}
          styles="w-12 h-full rounded-none"
          disabled={!selectedCell}
        />
      </div>

      <div className="flex h-full items-center">
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

export default EditorNavBar;

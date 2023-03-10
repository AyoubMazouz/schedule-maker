import React from "react";
import { ZOOM } from "../helpers/constants";

const EditorContext = React.createContext();

export const useEditorContext = () => {
  return React.useContext(EditorContext);
};

export const EditorContextProvider = ({ children }) => {
  // State.
  const [saved, setSaved] = React.useState(true);
  const [selectedCell, setSelectedCell] = React.useState(null);
  const [currSchedule, setCurrSchedule] = React.useState(0);
  // Modes.
  const [fusionMode, setFusionMode] = React.useState(true);
  // History for undo and redo.
  const [history, setHistory] = React.useState([]);
  const [hIndex, setHIndex] = React.useState(-1);

  // ClipBoard | copy, paste.
  const [clipboard, setClipboard] = React.useState(null);

  // View
  const [view, setView] = React.useState({
    zoom: Math.floor(ZOOM.length / 2),
    days: true,
    sessions: true,
  });

  // Close menu when clicking outside of it.
  const menuRef = React.useRef(null);
  const [currMenu, setCurrMenu] = React.useState(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setCurrMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <EditorContext.Provider
      value={{
        saved,
        setSaved,
        selectedCell,
        setSelectedCell,
        fusionMode,
        setFusionMode,
        history,
        setHistory,
        hIndex,
        setHIndex,
        currSchedule,
        setCurrSchedule,
        menuRef,
        currMenu,
        setCurrMenu,
        clipboard,
        setClipboard,
        view,
        setView,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

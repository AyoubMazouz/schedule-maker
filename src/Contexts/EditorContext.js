import React from "react";

const EditorContext = React.createContext();

export const useEditorContext = () => {
  return React.useContext(EditorContext);
};

export const EditorContextProvider = ({ children }) => {
  // State.
  const [saved, setSaved] = React.useState(true);
  const [selectedCell, setSelectedCell] = React.useState(null);
  // Modes.
  const [fusionMode, setFusionMode] = React.useState(true);
  // History for undo and redo.
  const [history, setHistory] = React.useState([]);
  const [hIndex, setHIndex] = React.useState(0);

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
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

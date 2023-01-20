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

    return (
        <EditorContext.Provider
            value={{
                saved,
                setSaved,
                selectedCell,
                setSelectedCell,
                fusionMode,
                setFusionMode,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};

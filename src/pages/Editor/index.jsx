import React from "react";
import { useParams } from "react-router-dom";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { EditorContextProvider } from "../../Contexts/EditorContext";
import { useAuth } from "../../Contexts/AuthContext";
// Components.
import DocumentsBar from "./DocumentsBar";
import EditorOptionBar from "./EditorOptionBar";
import Table from "./Table/Index";

const Editor = () => {
  const { loadData, setAlert, loadLabelsData } = useGlobalContext();
  const { currUser } = useAuth();
  const { docId } = useParams();

  React.useEffect(() => {
    document.title = `SH-Maker - Editor-${docId}`;
    loadData(currUser.username, docId);
    loadLabelsData(currUser.username);
  }, [docId]);

  // Prevent user from leaving the page with unsaved changes.
  React.useEffect(() => {
    if (EditorContextProvider.saved) window.onbeforeunload = null;
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
  }, [EditorContextProvider.saved]);

  return (
    <EditorContextProvider>
      <div className="md:grid md:grid-cols-12">
        <EditorOptionBar />
        <div className="col-span-full h-[calc(35vh-6rem)] overflow-x-hidden overflow-y-scroll border-r-2 border-dark/50 md:col-span-3 md:h-[calc(100vh-3rem)]">
          <DocumentsBar />
        </div>
        <div className="relative col-span-9 h-[65vh] overflow-scroll md:h-[calc(100vh-3rem)]">
          <Table />
        </div>
      </div>
    </EditorContextProvider>
  );
};

export default Editor;

import React from "react";
import { useParams } from "react-router-dom";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { EditorContextProvider } from "../../Contexts/EditorContext";
import { useAuth } from "../../Contexts/AuthContext";
// Components.
import DocumentsBar from "./DocumentsBar";
import OptionsBar from "./EditorNavBar";
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
      <div className="flex justify-center py-2">
        <div className="mx-2 w-full max-w-[1400px] gap-x-2 space-y-2 md:grid md:grid-cols-12">
          <OptionsBar />
          <div className="col-span-full overflow-hidden rounded-lg border md:col-span-3">
            <div className="h-[calc(35vh-6rem)] overflow-x-hidden overflow-y-scroll md:h-[calc(100vh-5.5rem)]">
              <DocumentsBar />
            </div>
          </div>
          <div className="col-span-9 overflow-hidden rounded-lg border">
            <div className="relative h-[65vh] overflow-scroll md:h-[calc(100vh-5.5rem)]">
              <Table />
            </div>
          </div>
        </div>
      </div>
    </EditorContextProvider>
  );
};

export default Editor;

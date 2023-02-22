import React from "react";
import { useParams } from "react-router-dom";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { EditorContextProvider } from "../../Contexts/EditorContext";
import { useAuth } from "../../Contexts/AuthContext";
// Components.
import EditorSideBar from "./EditorSideBar";
import Table from "./Table/Index";
import EditorNavBar from "./EditorNavBar";
import usePageTitle from "../../hooks/usePageTitle";

const Editor = () => {
  const { docId } = useParams();
  usePageTitle(docId);

  const { loadData, loadLabelsData } = useGlobalContext();
  const { currUser } = useAuth();

  React.useEffect(() => {
    loadData(currUser.username, docId);
    loadLabelsData(currUser.username);
  }, [docId]);

  return (
    <EditorContextProvider>
      <EditorNavBar />
      <div className="flex h-full w-full">
        <EditorSideBar />
        <div className="relative col-span-9 h-[65vh] w-full overflow-scroll">
          <Table />
        </div>
      </div>
    </EditorContextProvider>
  );
};

export default Editor;

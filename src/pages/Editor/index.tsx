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
      <div className="md:grid md:grid-cols-12">
        <EditorNavBar />
        <div className="col-span-full h-[calc(35vh-6rem)] overflow-x-hidden overflow-y-scroll border-r-[1px] border-dark/50 md:col-span-3 md:h-[calc(100vh-3rem)]">
          <EditorSideBar />
        </div>
        <div className="relative col-span-9 h-[65vh] overflow-scroll md:h-[calc(100vh-3rem)]">
          <Table />
        </div>
      </div>
    </EditorContextProvider>
  );
};

export default Editor;

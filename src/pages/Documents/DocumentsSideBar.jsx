import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcNewDoc, IcImport } from "../../helpers/icons";
import { useAuth } from "../../Contexts/AuthContext";

const DocumentsSideBar = () => {
  const { setModel } = useGlobalContext();
  const { importDocumentAsFile } = useEditor();
  const { currUser } = useAuth();
  const newDocHandler = (e) => {
    setModel({
      type: "newdoc",
    });
  };
  return (
    <div className="h-[calc(100vh-3rem)] min-w-[220px] max-w-[300px] border-r-[1px] border-dark/50">
      <button className="menu-item py-2" onClick={newDocHandler}>
        <IcNewDoc className="icon" />
        New
      </button>
      <button className="menu-item py-2">
        <IcImport className="icon" />
        import
        <input
          type="file"
          accept=".json"
          className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer opacity-0"
          onChange={(e) =>
            importDocumentAsFile(currUser.username, e.target.files[0])
          }
        />
      </button>
    </div>
  );
};

export default DocumentsSideBar;

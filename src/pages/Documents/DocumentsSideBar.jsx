import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcNewDoc, IcImport } from "../../helpers/icons";
import { Button } from "../../components/Button";
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
    <div className="min-w-[220px] max-w-[300px] border-r-[1px] border-dark/50">
      <Button
        type="primary"
        Icon={IcNewDoc}
        text="new"
        onClick={newDocHandler}
        styles="rounded-none w-full border-0 border-b-[1px] border-dark/50 shadow-none justify-center py-6"
      />
      <Button
        Icon={IcImport}
        text="import"
        styles="rounded-none w-full border-0 border-b-[1px] border-dark/50 shadow-none justify-center py-6"
      >
        <input
          type="file"
          accept=".json"
          className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
          onChange={(e) =>
            importDocumentAsFile(currUser.username, e.target.files[0])
          }
        />
      </Button>
    </div>
  );
};

export default DocumentsSideBar;

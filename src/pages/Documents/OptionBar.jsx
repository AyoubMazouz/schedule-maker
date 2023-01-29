import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcNewDoc, IcImport } from "../../helpers/icons";
import { Button } from "../../components/Button";
import { useAuth } from "../../Contexts/AuthContext";

const OptionBar = () => {
  const { setModel } = useGlobalContext();
  const { importDocumentAsFile } = useEditor();
  const { currUser } = useAuth();
  const newDocHandler = (e) => {
    setModel({
      type: "newdoc",
    });
  };
  return (
    <div className="flex justify-between rounded-lg border p-2 shadow-md">
      <div className="flex gap-x-4">
        <Button
          type="success"
          Icon={IcNewDoc}
          text="new"
          onClick={newDocHandler}
        />
        <Button Icon={IcImport} text="import">
          <input
            type="file"
            accept=".json"
            className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer opacity-0"
            onChange={(e) =>
              importDocumentAsFile(currUser.uid, e.target.files[0])
            }
          />
        </Button>
      </div>
    </div>
  );
};

export default OptionBar;

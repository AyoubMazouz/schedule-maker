import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcCancel, IcDoc, IcEdit } from "../../helpers/icons";
import { useAuth } from "../../Contexts/AuthContext";
import { Input } from "../Input";

const RenDoc = () => {
  const { model, setModel } = useGlobalContext();
  const { setDocumentInfo } = useDocument();
  const { currUser } = useAuth();

  const [newId, setNewId] = React.useState(model.value);

  const renameHandler = async () => {
    setModel(null);
    await setDocumentInfo(currUser.username, model.value, "id", newId);
  };
  return (
    <>
      <Input
        type="text"
        label="rename document"
        Icon={IcDoc}
        placeholder="Document name..."
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
      />
      <div className="model-btn-container">
        <Button
          text="Rename"
          type="success"
          onClick={renameHandler}
          Icon={IcEdit}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default RenDoc;

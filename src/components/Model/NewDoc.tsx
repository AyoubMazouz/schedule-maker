import React from "react";
import { useNavigate } from "react-router-dom";
import { EMPTY_SCHEDULE } from "../../helpers/constants";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcSave, IcCancel, IcDoc } from "../../helpers/icons";
import { Input } from "../Input";

const NewDoc = () => {
  const navigate = useNavigate();

  const { setModel, setDocId } = useGlobalContext();
  const { currUser } = useAuth();
  const { addNewDocument } = useDocument();
  const [newId, setNewId] = React.useState("");

  const createHandler = async () => {
    setModel(null);
    await addNewDocument(currUser.username, newId, [EMPTY_SCHEDULE]);
    setDocId(newId);
    navigate("/editor/" + newId);
  };

  return (
    <>
      <Input
        type="text"
        label="new document"
        Icon={IcDoc}
        placeholder="Document name..."
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
      />
      <div className="model-btn-container">
        <Button
          text="save"
          type="success"
          onClick={createHandler}
          Icon={IcSave}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default NewDoc;

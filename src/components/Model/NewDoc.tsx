import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcSave, IcCancel, IcDoc } from "../../helpers/icons";
import { Input } from "../Input";

const NewDoc = () => {
  const { setModel } = useGlobalContext();
  const { currUser } = useAuth();
  const { addNewDocument } = useDocument();
  const navigate = useNavigate();
  const [newId, setNewId] = React.useState("");

  const createHandler = async () => {
    setModel(null);
    await addNewDocument(currUser.username, newId, "OFPPT");
    navigate("/editor/" + newId);
  };

  return (
    <>
      <Button
        text="OFFPt"
        type="success"
        onClick={createHandler}
        Icon={IcSave}
      />
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

import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcBin, IcCancel } from "../../helpers/icons";
import { useAuth } from "../../Contexts/AuthContext";

const DelDoc = () => {
  const { model, setModel, setAlert } = useGlobalContext();
  const { deleteDocument } = useDocument();
  const { currUser } = useAuth();

  return (
    <>
      <div>{`Do you Really want to delete document "${model.name}"?`}</div>
      <div className="model-btn-container">
        <Button
          text="delete"
          type="danger"
          onClick={() => {
            deleteDocument(currUser.username, model.name);
            setModel(null);
            setAlert("warn", `Document "${model.name}" has been deleted.`);
          }}
          Icon={IcBin}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default DelDoc;

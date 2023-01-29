import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/usePublish";
import { Button } from "../Button";
import { IcBin, IcCancel } from "../../helpers/icons";
import { useAuth } from "../../Contexts/AuthContext";

const DelPubDoc = () => {
  const { model, setModel, setAlert } = useGlobalContext();
  const { deletePublishedDocument } = useSettings();
  const { currUser } = useAuth();

  return (
    <>
      <div>{`Do you Really want to delete document "${model.id}"?`}</div>
      <div className="model-btn-container">
        <Button
          text="delete"
          type="danger"
          onClick={() => {
            deletePublishedDocument(currUser.uid, model.id);
            setModel(null);
            setAlert({
              type: "warn",
              message: `Document "${model.id}" has been deleted.`,
            });
          }}
          Icon={IcBin}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default DelPubDoc;

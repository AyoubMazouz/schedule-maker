import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcCancel, IcEx, IcTrue } from "../../helpers/icons";

const Exit = () => {
  const { setModel, docId, data, setAlert } = useGlobalContext();
  const { addNewDocument } = useDocument();
  const { currUser } = useAuth();

  const navigate = useNavigate();

  return (
    <>
      <div>Do you want to save before exiting?</div>
      <div className="model-btn-container">
        <Button
          text="Yes"
          type="success"
          onClick={async () => {
            setModel(null);
            navigate("/documents");
            await addNewDocument(data, currUser.uid, docId);
            setAlert({
              type: "success",
              message: "Document has been saved!",
            });
          }}
          Icon={IcTrue}
        />
        <Button
          text="No"
          onClick={() => {
            setModel(null);
            navigate("/documents");
          }}
          Icon={IcEx}
        />
        <Button text="Cancel" onClick={() => setModel(null)} Icon={IcCancel} />
      </div>
    </>
  );
};

export default Exit;

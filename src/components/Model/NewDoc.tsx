import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcSave, IcCancel, IcDoc, IcHelp } from "../../helpers/icons";
import { Input } from "../Input";
import { TEMPLATES } from "../../helpers/templates";

const NewDoc = () => {
  const { setModel, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { addNewDocument } = useDocument();
  const navigate = useNavigate();
  const [newId, setNewId] = React.useState("");
  const [selected, setSelected] = React.useState(-1);

  const createHandler = async () => {
    if (newId.trim().length === 0)
      return setAlert(
        "warn",
        "you may have forgot to set a name for this document."
      );
    if (selected < 0) return setAlert("warn", "you must select template type!");
    setModel(null);
    await addNewDocument(
      currUser.username,
      newId,
      Object.keys(TEMPLATES)[selected]
    );
    navigate("/editor/" + newId);
  };

  return (
    <>
      {Object.values(TEMPLATES).map((temp: any, index: number) => (
        <div
          key={temp.labels.sessions[0] + index}
          onClick={() => setSelected(index)}
          className={`${
            selected === index
              ? "ring-2 ring-primary"
              : "ring-[1px] ring-dark/50"
          } flex cursor-pointer justify-between rounded-md p-2 text-left transition-all duration-100 hover:ring-primary`}
        >
          <div>
            <div>Days:{temp.labels.days.length}</div>
            <div>Sessions:{temp.labels.sessions.length}</div>
            <div>Session Duration:{temp.labels.sessionDuration}</div>
          </div>
          <div className="relative group ">
            <IcHelp className="icon" />
            <div className="absolute top-[20%] left-[50%] w-[6rem] translate-x-[-50%]  translate-y-[-110%] rounded-md opacity-0 shadow-md transition-all duration-500 group-hover:top-[5%] group-hover:opacity-100">
              <img src="/assets/default-profile.png" />
            </div>
          </div>
        </div>
      ))}
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

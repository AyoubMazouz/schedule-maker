import React from "react";
import { useNavigate } from "react-router-dom";
import { EMPTY_SCHEDUAL } from "../../constants";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcSave, IcCancel } from "../icons";

const NewDoc = () => {
    const navigate = useNavigate();

    const { setModel, setDocId } = useGlobalContext();
    const { currUser } = useAuth();
    const { addNewDocument } = useDocument();
    const [newDocId, setNewDocId] = React.useState("");

    const createHandler = async () => {
        setModel(null);
        await addNewDocument(currUser.uid, newDocId, [EMPTY_SCHEDUAL]);
        setDocId(newDocId);
        navigate("/editor/" + newDocId);
    };

    return (
        <>
            <div className="flex flex-col gap-y-2">
                <label htmlFor="name" className="input-label">
                    New Document Name:
                </label>
                <input
                    type="text"
                    className="input"
                    value={newDocId}
                    onChange={(e) => setNewDocId(e.target.value)}
                />
            </div>
            <div className="model-btn-container">
                <Button
                    text="save"
                    type="success"
                    onClick={createHandler}
                    Icon={IcSave}
                />
                <Button
                    text="Cancel"
                    onClick={() => setModel(null)}
                    Icon={IcCancel}
                />
            </div>
        </>
    );
};

export default NewDoc;

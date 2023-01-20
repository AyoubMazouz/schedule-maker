import React from "react";
import { useNavigate } from "react-router-dom";
import { EMPTY_SCHEDUAL } from "../../constants";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcSave, IcRemove, IcEdit, IcEx, IcCancel } from "../icons";

const NewDoc = () => {
    const navigate = useNavigate();

    const [docName, setDocName] = React.useState("");
    const { setModel, setName, data, loadData } = useGlobalContext();
    const { addNewDocument } = useEditor();

    const createHandler = async () => {
        setModel(null);
        await addNewDocument([EMPTY_SCHEDUAL], docName);
        setName(docName);
        navigate("/editor/" + docName);
    };

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
            >
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="name" className="input-label">
                        New Document Name:
                    </label>
                    <input
                        type="text"
                        className="input"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                    />
                </div>
                <div className="mt-8 flex gap-x-6">
                    <button className="btn-success" onClick={createHandler}>
                        <IcSave className="icon" />
                        <span>Save</span>
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setModel(null)}
                    >
                        <IcCancel className="icon" />
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewDoc;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../pages/Editor/useEditor";
import { IcEx, IcRemove, IcTrue } from "../icons";

const Exit = () => {
    const { setModel, name, data, setAlert } = useGlobalContext();
    const { addNewDocument } = useEditor();

    const navigate = useNavigate();

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
            >
                <div className="">Do you want to save before exiting?</div>
                <div className="mt-4 flex gap-x-6">
                    <button
                        className="btn"
                        onClick={() => {
                            addNewDocument(data, name);
                            setModel(null);
                            setAlert({
                                type: "success",
                                message: "Document has been saved!",
                            });
                            navigate("/documents");
                        }}
                    >
                        <IcTrue className="icon" />
                        <span>Yes</span>
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            setModel(null);
                            navigate("/documents");
                        }}
                    >
                        <IcEx className="icon" />
                        <span>No</span>
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setModel(null)}
                    >
                        <IcEx className="icon" />
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Exit;
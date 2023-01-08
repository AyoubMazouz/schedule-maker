import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { IcEdit, IcRemove, IcSave, IcTrue } from "./icons";

const Model = () => {
    const { model, setModel, setName, setAlert } = useGlobalContext();

    const [newdoc, setNewdoc] = React.useState("");

    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (model && model.type === "renamedoc") {
            setNewdoc(model.name);
        }
    }, [model]);

    if (!model) return null;

    if (model.type === "yesno")
        return (
            <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
                <div
                    className={`w-full rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
                >
                    <div>{model.message}</div>
                    <div className="mt-8 flex gap-x-6">
                        <button className="btn" onClick={() => model.yes()}>
                            <IcTrue className="icon" />
                            <span>Yes</span>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => model.no()}
                        >
                            <IcRemove className="icon" />
                            <span>No</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    if (model.type === "deldoc")
        return (
            <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
                <div
                    className={`w-full rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
                >
                    <div>{`Do you Really want to delete document "${model.name}"?`}</div>
                    <div className="mt-8 flex gap-x-6">
                        <button
                            className="btn-danger"
                            onClick={() => {
                                model.func();
                                setModel(null);
                                setAlert({
                                    type: "success",
                                    message: `Document "${model.name}" has been deleted.`,
                                });
                            }}
                        >
                            <IcRemove className="icon" />
                            <span>Delete</span>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => setModel(null)}
                        >
                            <IcRemove className="icon" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    else if (model.type === "newdoc")
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
                            value={newdoc}
                            onChange={(e) => setNewdoc(e.target.value)}
                        />
                    </div>
                    <div className="mt-8 flex gap-x-6">
                        <button
                            className="btn-success"
                            onClick={() => {
                                model.func(newdoc);
                                setName(newdoc);
                                setModel(null);
                                navigate("/editor/documents/" + newdoc);
                            }}
                        >
                            <IcSave className="icon" />
                            <span>Save</span>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => setModel(null)}
                        >
                            <IcRemove className="icon" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    else if (model.type === "renamedoc")
        return (
            <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
                <div
                    className={`rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
                >
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="name" className="input-label">
                            Rename Document:
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={newdoc}
                            onChange={(e) => setNewdoc(e.target.value)}
                        />
                    </div>
                    <div className="mt-8 flex gap-x-6">
                        <button
                            className="btn-success"
                            onClick={() => {
                                model.func(newdoc);
                                setModel(null);
                            }}
                        >
                            <IcEdit className="icon" />
                            <span>Rename</span>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => setModel(null)}
                        >
                            <IcRemove className="icon" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    else if (model.type === "exit")
        return (
            <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
                <div
                    className={`rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
                >
                    <div className="">{model.message}</div>
                    <div className="mt-4 flex gap-x-6">
                        <button
                            className="btn"
                            onClick={() => {
                                if (location.pathname === "/editor") {
                                    setModel({
                                        type: "newdoc",
                                        func: (newName) =>
                                            model.func(model.data, newName),
                                    });
                                } else {
                                    model.func();
                                    setModel(false);
                                    navigate("/editor/documents");
                                }
                            }}
                        >
                            <IcTrue className="icon" />
                            <span>Yes</span>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setModel(false);
                                navigate("/editor/documents");
                            }}
                        >
                            <IcRemove className="icon" />
                            <span>No</span>
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => setModel(null)}
                        >
                            <IcRemove className="icon" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        );

    return null;
};

export default Model;

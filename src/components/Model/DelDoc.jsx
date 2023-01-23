import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { Button } from "../Button";
import { IcBin, IcCancel } from "../icons";

const DelDoc = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { deleteDocument } = useEditor();

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`w-full rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
            >
                <div>{`Do you Really want to delete document "${model.name}"?`}</div>
                <div className="flex mt-8 gap-x-6">
                    <Button
                        text="delete"
                        type="danger"
                        onClick={() => {
                            deleteDocument(model.name);
                            setModel(null);
                            setAlert({
                                type: "warn",
                                message: `Document "${model.name}" has been deleted.`,
                            });
                        }}
                        Icon={IcBin}
                    />
                    <Button
                        text="Cancel"
                        onClick={() => setModel(null)}
                        Icon={IcCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default DelDoc;

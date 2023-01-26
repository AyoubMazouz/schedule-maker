import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcBin, IcCancel } from "../icons";

const DelDoc = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { deleteDocument } = useDocument();

    return (
        <>
            <div>{`Do you Really want to delete document "${model.name}"?`}</div>
            <div className="model-btn-container">
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
        </>
    );
};

export default DelDoc;

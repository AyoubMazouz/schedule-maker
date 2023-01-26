import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/usePublish";
import { Button } from "../Button";
import { IcBin, IcCancel } from "../icons";

const DelPubDoc = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { deletePublishedDocument } = useSettings();

    return (
        <>
            <div>{`Do you Really want to delete document "${model.id}"?`}</div>
            <div className="model-btn-container">
                <Button
                    text="delete"
                    type="danger"
                    onClick={() => {
                        deletePublishedDocument(model.id);
                        setModel(null);
                        setAlert({
                            type: "warn",
                            message: `Document "${model.id}" has been deleted.`,
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

export default DelPubDoc;

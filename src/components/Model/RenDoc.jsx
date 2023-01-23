import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useDocument from "../../hooks/useDocument";
import { Button } from "../Button";
import { IcCancel, IcEdit } from "../icons";

const RenDoc = () => {
    const { model, setModel } = useGlobalContext();
    const { renameDocument } = useDocument();

    const [newDocName, setNewDocName] = React.useState(model.value);

    const renameHandler = async () => {
        setModel(null);
        await renameDocument(model.value, newDocName);
    };
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
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                    />
                </div>
                <div className="flex mt-8 gap-x-6">
                    <Button
                        text="Rename"
                        type="success"
                        onClick={renameHandler}
                        Icon={IcEdit}
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

export default RenDoc;

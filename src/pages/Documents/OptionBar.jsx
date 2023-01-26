import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcNewDoc, IcImport } from "../../components/icons";
import { Button } from "../../components/Button";

const OptionBar = () => {
    const { setModel } = useGlobalContext();
    const { importDocumentAsFile } = useEditor();
    const newDocHandler = (e) => {
        setModel({
            type: "newdoc",
        });
    };
    return (
        <div className="flex justify-between p-2 m-2 border rounded-lg shadow-md">
            <div className="flex gap-x-4">
                <Button
                    type="success"
                    Icon={IcNewDoc}
                    text="new"
                    onClick={newDocHandler}
                />
                <Button Icon={IcImport} text="import">
                    <input
                        type="file"
                        accept=".json,.xlsm,.xls"
                        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                        onChange={importDocumentAsFile}
                    />
                </Button>
            </div>
        </div>
    );
};

export default OptionBar;

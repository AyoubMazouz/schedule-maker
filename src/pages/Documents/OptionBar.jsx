import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { IcNewDoc, IcImport } from "../../components/icons";

const OptionBar = () => {
    const { setModel } = useGlobalContext();
    const { importDocumentAsFile } = useEditor();
    const newDocHandler = (e) => {
        setModel({
            type: "newdoc",
        });
    };
    return (
        <div className="flex justify-between p-2 m-2 border-2 rounded-lg shadow-md border-dark/25">
            <div className="flex gap-x-4">
                <button className="btn-success" onClick={newDocHandler}>
                    <IcNewDoc className="icon" />
                    <span>New</span>
                </button>
                <button className="relative overflow-hidden btn-secondary">
                    <input
                        type="file"
                        accept=".json,.xlsm,.xls"
                        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                        onChange={importDocumentAsFile}
                    />
                    <IcImport className="icon" />
                    <span>Import</span>
                </button>
            </div>
        </div>
    );
};

export default OptionBar;
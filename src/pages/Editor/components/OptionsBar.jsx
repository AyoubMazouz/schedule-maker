import React from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useEditor from "../useEditor";
import { downloadShedual } from "../download";
import {
    IcDown,
    IcDownload,
    IcExport,
    IcImport,
    IcPlus,
    IcRemove,
    IcSave,
} from "../../../components/icons";

const OptionBar = () => {
    const { addNewDocument, documentExists, importDocument, exportDocument } =
        useEditor();
    const { data, setData, loadData, loadNew, name, setModel, setAlert } =
        useGlobalContext();

    const { nameid } = useParams();

    const menuRef = React.useRef(null);
    const [currMenu, setCurrMenu] = React.useState(null);

    React.useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setCurrMenu(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    React.useEffect(() => {
        loadData(nameid);
    }, []);

    const saveHandler = async () => {
        if (!name) {
            setModel({
                type: "newdoc",
                func: (newName) => addNewDocument(data, newName),
            });
        } else if (await documentExists(name)) {
            addNewDocument(data, name);
            setAlert({ type: "success", message: "Saved Successfuly!" });
        } else {
            setModel({
                type: "newdoc",
                func: (newName) => addNewDocument(data, newName),
            });
        }
        setCurrMenu(null);
    };

    const exitHandler = async () => {
        setModel({
            type: "exit",
            message: "Do you want to save before exiting?",
            func: addNewDocument,
            data,
        });
        setCurrMenu(null);
    };

    const downloadHandler = () => {
        downloadShedual(data);
        setAlert({ type: "success", message: "Download has started..." });
        setCurrMenu(null);
    };

    const exportHandler = () => {
        exportDocument(data);
        setAlert({
            type: "success",
            message:
                "Document has been exported as JSON string on your clipboard. created a new file with '.json' extention and paste the string in it.",
        });
        setCurrMenu(null);
    };

    return (
        <div className="sticky top-0 z-30 flex w-full justify-between p-2">
            <div>
                <button
                    className="btn-secondary"
                    onClick={() => setCurrMenu("file")}
                >
                    <IcDown className="icon" />
                    <span>File</span>
                </button>
                {currMenu === "file" && (
                    <div ref={menuRef} className="menu top-[96%] left-[1%]">
                        <button className="menu-item" onClick={saveHandler}>
                            <IcSave className="icon" />
                            <span>Save</span>
                        </button>
                        <button className="menu-item" onClick={() => loadNew()}>
                            <IcPlus className="icon" />
                            <span>New</span>
                        </button>
                        <div className="menu-item relative overflow-hidden">
                            <input
                                type="file"
                                accept=".json"
                                className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer opacity-0"
                                onChange={(e) =>
                                    importDocument(setData, e.target.files[0])
                                }
                            />
                            <IcImport className="icon" />
                            <span>Import</span>
                        </div>
                        <button className="menu-item" onClick={exportHandler}>
                            <IcExport className="icon" />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={exitHandler}
                            className="menu-item border-b-0"
                        >
                            <IcRemove className="icon" />
                            <span>Exit</span>
                        </button>
                    </div>
                )}
            </div>
            <button className="btn" onClick={downloadHandler}>
                <IcDownload className="icon" />
                <span>Download</span>
            </button>
        </div>
    );
};

export default OptionBar;

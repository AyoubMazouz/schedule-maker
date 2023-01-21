import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useEditor from "../../../hooks/useEditor";
import {
    IcBin,
    IcClearCell,
    IcDown,
    IcDownload,
    IcExport,
    IcFusion,
    IcImport,
    IcLogout,
    IcNewDoc,
    IcSave,
} from "../../../components/icons";
import { useEditorContext } from "../../../Contexts/EditorContext";

const OptionBar = () => {
    const { saved, setSaved, setFusionMode, fusionMode, selectedCell } =
        useEditorContext();
    const { data, setData, loadData, setModel, setAlert, setName } =
        useGlobalContext();
    const {
        addNewDocument,
        importDocument,
        exportDocument,
        downloadAsPdf,
        clearCell,
    } = useEditor();

    const { nameid } = useParams();
    const navigate = useNavigate();

    const menuRef = React.useRef(null);
    const [currMenu, setCurrMenu] = React.useState(null);
    const [newDocName, setNewDocName] = React.useState(nameid);

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
        setNewDocName(nameid);
        setName(nameid);
        loadData(nameid);
    }, [nameid]);

    const saveHandler = async () => {
        setCurrMenu(null);
        await addNewDocument(data, newDocName);
        setSaved(true);
    };

    const exitHandler = async () => {
        if (saved) navigate("/documents");
        else
            setModel({
                type: "exit",
            });

        setCurrMenu(null);
    };

    const downloadHandler = () => {
        downloadAsPdf(data, nameid);
        setAlert({ type: "success", message: "Download has started..." });
        setCurrMenu(null);
    };

    const exportHandler = () => {
        exportDocument(data, newDocName);
        setCurrMenu(null);
    };
    const newDocHandler = (e) => {
        setModel({
            type: "newdoc",
        });
    };

    const clearCellHandler = () => {
        const [schedualIndex, dayIndex, sessionIndex] = selectedCell
            .split("")
            .map((i) => parseInt(i));
        const res = clearCell(
            data,
            setData,
            fusionMode,
            schedualIndex,
            dayIndex,
            sessionIndex
        );
        if (res) setSaved(false);
    };

    return (
        <div className="sticky top-0 z-30 flex justify-between w-full p-2">
            <div className="flex gap-6">
                <button
                    className={`btn-secondary relative ${
                        !saved &&
                        "after:absolute after:top-[0%] after:right-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
                    }`}
                    onClick={() => setCurrMenu("file")}
                >
                    <IcDown className="text-xl" />
                    <span>File</span>
                </button>
                {currMenu === "file" && (
                    <div ref={menuRef} className="menu top-[96%] left-[1%]">
                        <button
                            disabled={saved}
                            className={`menu-item relative ${
                                !saved &&
                                "after:absolute after:top-[38%] after:left-[0%] after:h-3 after:w-3 after:translate-x-[50%] after:translate-y-[-50%] after:animate-pulse after:rounded-full after:bg-emerald-500"
                            }`}
                            onClick={saveHandler}
                        >
                            <IcSave className="icon" />
                            <span>Save</span>
                        </button>
                        <button className="menu-item " onClick={newDocHandler}>
                            <IcNewDoc className="icon" />
                            <span>New</span>
                        </button>
                        <div className="relative overflow-hidden menu-item">
                            <input
                                type="file"
                                accept=".json,.xls,.xlsm"
                                className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    importDocument(e.target.files[0], setData)
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
                            className="border-b-0 menu-item"
                        >
                            <IcLogout className="icon" />
                            <span>Exit</span>
                        </button>
                    </div>
                )}
                <div className="flex gap-x-2">
                    <button
                        className={`flex h-8 w-8 items-center justify-center rounded transition-all duration-300 hover:bg-dark/25 ${
                            fusionMode ? "bg-primary/25" : ""
                        }`}
                        onClick={() => setFusionMode((x) => !x)}
                    >
                        <IcFusion className="icon" />
                    </button>
                    <button
                        className={`flex h-8 w-8 items-center justify-center rounded transition-all duration-300 hover:bg-dark/25`}
                        onClick={clearCellHandler}
                    >
                        <IcBin className="icon" />
                    </button>
                </div>
            </div>
            <button className="btn" onClick={downloadHandler}>
                <IcDownload className="icon" />
                <span>Download</span>
            </button>
        </div>
    );
};

export default OptionBar;

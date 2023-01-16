import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useEditor from "../useEditor";
import {
    IcDown,
    IcDownload,
    IcExport,
    IcImport,
    IcLogout,
    IcNewDoc,
    IcSave,
} from "../../../components/icons";

const OptionBar = ({ saved, setSaved }) => {
    const { addNewDocument, importDocument, exportDocument, downloadAsPdf } =
        useEditor();
    const { data, setData, loadData, name, setModel, setAlert } =
        useGlobalContext();

    const { nameid } = useParams();
    const navigate = useNavigate();

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
        setCurrMenu(null);
        await addNewDocument(data, name);
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
        downloadAsPdf(data);
        setAlert({ type: "success", message: "Download has started..." });
        setCurrMenu(null);
    };

    const exportHandler = () => {
        exportDocument(data, name);
        setCurrMenu(null);
    };
    const newDocHandler = (e) => {
        setModel({
            type: "newdoc",
        });
    };

    return (
        <div className="sticky top-0 z-30 flex w-full justify-between p-2">
            <div>
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
                        <div className="menu-item relative overflow-hidden">
                            <input
                                type="file"
                                accept=".json,.xls,.xlsm"
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
                            <IcLogout className="icon" />
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

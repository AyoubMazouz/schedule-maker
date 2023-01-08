import React from "react";
import useEditor from "../useEditor";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import {
    IcDelete,
    IcDownload,
    IcEdit,
    IcExport,
    IcImport,
    IcMore,
    IcPlus,
    IcRefresh,
    IcRemove,
} from "../../../components/icons";
import { downloadShedual } from "../download";

const Documents = () => {
    const {
        getAllDocuments,
        deleteDocument,
        renameDocument,
        importDocument,
        exportDocument,
    } = useEditor();
    const { loadNew, setModel, setData, data, setAlert } = useGlobalContext();

    const [documents, setDocuments] = React.useState([]);

    const update = () => getAllDocuments().then((docs) => setDocuments(docs));
    React.useEffect(() => {
        update();
    }, []);

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

    const deleteHandler = (name) => {
        setModel({
            type: "deldoc",
            name,
            func: () => {
                deleteDocument(name);
                update();
            },
        });
        setCurrMenu(null);
    };

    const renameHandler = (name) => {
        setModel({
            type: "renamedoc",
            name,
            func: (newName) => renameDocument(name, newName),
        });
        setCurrMenu(null);
    };

    const downloadHandler = () => {
        downloadShedual(data);
        setAlert({ type: "success", message: "Download has started..." });
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
        <div className="flex justify-center">
            <div className="w-full max-w-[1400px]">
                <div className="m-2 flex justify-between rounded-lg border-2 border-dark/25 p-2">
                    <div className="flex gap-x-4">
                        <button
                            className="btn-success"
                            onClick={() => loadNew()}
                        >
                            <IcPlus className="icon" />
                            <span>New</span>
                        </button>
                        <div className="btn-secondary relative overflow-hidden">
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
                    </div>
                    <button className="btn-secondary" onClick={() => update()}>
                        <IcRefresh className="icon" />
                        <span>refresh</span>
                    </button>
                </div>
                <div className="my-2 grid grid-cols-10 px-4 text-center">
                    <div className="col-span-3 text-left font-semibold">
                        Name
                    </div>
                    <div className="col-span-3 font-semibold">CreatedAt</div>
                    <div className="col-span-3 font-semibold">ModifiedAt</div>
                    <div></div>
                </div>
                {documents.map((doc, docIndex) => (
                    <div
                        className={`group grid grid-cols-10 px-4 text-center ${
                            docIndex % 2 === 0 && "bg-dark/5"
                        } hover:bg-secondary`}
                    >
                        <Link
                            to={"/editor/documents/" + doc.name}
                            className="col-span-9 grid grid-cols-3"
                        >
                            <div className="text-left group-hover:underline">
                                {doc.name}
                            </div>
                            <div className="">
                                {doc.createdAt.toDate().toDateString()}
                            </div>
                            <div className="">
                                {doc.modifiedAt.toDate().toDateString()}
                            </div>
                        </Link>
                        <div className="relative flex gap-x-2 text-end">
                            <button onClick={(e) => setCurrMenu(doc.name)}>
                                <IcMore
                                    className={
                                        currMenu === doc.name
                                            ? "icon rotate-90 text-secondary transition-all duration-300"
                                            : "icon"
                                    }
                                />
                            </button>
                            {currMenu === doc.name && (
                                <div
                                    ref={menuRef}
                                    className="menu top-[0%] left-[0%] translate-x-[-100%]"
                                >
                                    <button
                                        className="menu-item"
                                        onClick={() => renameHandler(doc.name)}
                                    >
                                        <IcEdit className="icon" />
                                        <span>rename</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={exportHandler}
                                    >
                                        <IcExport className="icon" />
                                        <span>Export</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={downloadHandler}
                                    >
                                        <IcDownload className="icon" />
                                        <span>Download</span>
                                    </button>
                                    <button
                                        className="menu-item"
                                        onClick={() => deleteHandler(doc.name)}
                                    >
                                        <IcDelete className="icon" />{" "}
                                        <span>delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documents;

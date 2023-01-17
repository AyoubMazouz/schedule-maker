import React from "react";
import useEditor from "../useEditor";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import {
    IcBin,
    IcDoc,
    IcDownload,
    IcEdit,
    IcExport,
    IcImport,
    IcMore,
    IcNewDoc,
} from "../../../components/icons";

const Documents = () => {
    const {
        getAllDocuments,
        importDocumentAsFile,
        exportDocument,
        downloadAsPdf,
    } = useEditor();
    const { setModel, data, setAlert } = useGlobalContext();

    const [documents, setDocuments] = React.useState([]);

    React.useEffect(() => {
        getAllDocuments(setDocuments);
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
        });
        setCurrMenu(null);
    };

    const renameHandler = (docName) => {
        setModel({
            type: "rendoc",
            docName,
        });
        setCurrMenu(null);
    };

    const downloadHandler = (doc) => {
        downloadAsPdf(JSON.parse(doc.data), doc.name);
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

    const newDocHandler = (e) => {
        setModel({
            type: "newdoc",
        });
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[1400px]">
                <div className="m-2 flex justify-between rounded-lg border-2 border-dark/25 p-2 shadow-md">
                    <div className="flex gap-x-4">
                        <button className="btn-success" onClick={newDocHandler}>
                            <IcNewDoc className="icon" />
                            <span>New</span>
                        </button>
                        <button className="btn-secondary relative overflow-hidden">
                            <input
                                type="file"
                                accept=".json,.xlsm,.xls"
                                className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer opacity-0"
                                onChange={importDocumentAsFile}
                            />
                            <IcImport className="icon" />
                            <span>Import</span>
                        </button>
                    </div>
                </div>
                <div className="mx-2 rounded-lg border-2 border-dark/25 shadow-lg">
                    {documents.map((doc, docIndex) => (
                        <div
                            className={`menu-item group flex justify-between text-center ${
                                docIndex % 2 === 0 && "bg-dark/5"
                            }`}
                        >
                            <Link
                                to={"/editor/" + doc.name}
                                className="grid w-full grid-cols-12"
                            >
                                <div className="col-span-full space-x-1 text-left group-hover:underline sm:col-span-9 md:col-span-6">
                                    <IcDoc className="icon inline-block" />
                                    <span>
                                        {doc.name.length > 30
                                            ? doc.name.slice(0, 38) + "..."
                                            : doc.name}
                                    </span>
                                </div>
                                <div className="col-span-3 hidden sm:block">
                                    {doc.createdAt.toDate().toDateString()}
                                </div>
                                <div className="col-span-3 hidden md:block">
                                    {doc.modifiedAt.toDate().toDateString()}
                                </div>
                            </Link>
                            <div className="relative flex gap-x-2 text-end">
                                <button onClick={(e) => setCurrMenu(doc.name)}>
                                    <IcMore
                                        className={
                                            currMenu === doc.name
                                                ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                                : "text-xl"
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
                                            onClick={() =>
                                                renameHandler(doc.name)
                                            }
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
                                            onClick={(e) =>
                                                downloadHandler(doc)
                                            }
                                        >
                                            <IcDownload className="icon" />
                                            <span>Download</span>
                                        </button>
                                        <button
                                            className="menu-item"
                                            onClick={() =>
                                                deleteHandler(doc.name)
                                            }
                                        >
                                            <IcBin className="icon" />{" "}
                                            <span>delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Documents;

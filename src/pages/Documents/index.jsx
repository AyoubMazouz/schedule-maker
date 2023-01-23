import React from "react";
import useEditor from "../../hooks/useEditor";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import {
    IcAbout,
    IcBin,
    IcDoc,
    IcDownload,
    IcEdit,
    IcExport,
    IcMore,
} from "../../components/icons";
import OptionBar from "./OptionBar";
import useDocument from "../../hooks/useDocument";

const Documents = () => {
    const { exportDocument, downloadAsPdf } = useEditor();
    const { getAllDocuments } = useDocument();
    const { setModel, data, setAlert } = useGlobalContext();

    const [documents, setDocuments] = React.useState([]);

    React.useEffect(() => {
        document.title = `SH-Maker - Documents`;
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

    const renameHandler = (value) => {
        setModel({
            type: "rendoc",
            value,
        });
        setCurrMenu(null);
    };

    const downloadHandler = (doc) => {
        downloadAsPdf(JSON.parse(doc.data), doc.name);
        setAlert({
            type: "success",
            message: `Document ${doc.name} has started downloading...`,
        });
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

    const showDetails = (v) => {
        const details = [
            ["id", v.id],
            ["document name", v.name],
            ["created at", v.createdAt.toDate().toDateString()],
            ["modified at", v.modifiedAt.toDate().toDateString()],
        ];
        setModel({ type: "showDetails", details });
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[1400px]">
                <OptionBar />
                <div className="mx-2 border-2 rounded-lg shadow-lg border-dark/25">
                    {documents.map((value, docIndex) => (
                        <div
                            className={`menu-item group flex justify-between text-center ${
                                docIndex % 2 === 0 && "bg-dark/5"
                            }`}
                        >
                            <Link
                                to={"/editor/" + value.name}
                                className="grid w-full grid-cols-12"
                            >
                                <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9 md:col-span-6">
                                    <IcDoc className="inline-block icon" />
                                    <span>
                                        {value.name.length > 30
                                            ? value.name.slice(0, 38) + "..."
                                            : value.name}
                                    </span>
                                </div>
                                <div className="hidden col-span-3 sm:block">
                                    {value.createdAt.toDate().toDateString()}
                                </div>
                                <div className="hidden col-span-3 md:block">
                                    {value.modifiedAt.toDate().toDateString()}
                                </div>
                            </Link>
                            <div className="relative flex gap-x-2 text-end">
                                <button
                                    onClick={(e) => setCurrMenu(value.name)}
                                >
                                    <IcMore
                                        className={
                                            currMenu === value.name
                                                ? "rotate-90 text-xl text-secondary transition-all duration-300"
                                                : "text-xl"
                                        }
                                    />
                                </button>
                                {currMenu === value.name && (
                                    <div
                                        ref={menuRef}
                                        className="menu top-[0%] left-[0%] translate-x-[-100%]"
                                    >
                                        <button
                                            className="menu-item"
                                            onClick={() =>
                                                renameHandler(value.name)
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
                                                downloadHandler(value)
                                            }
                                        >
                                            <IcDownload className="icon" />
                                            <span>Download</span>
                                        </button>
                                        <button
                                            className="menu-item"
                                            onClick={() =>
                                                deleteHandler(value.name)
                                            }
                                        >
                                            <IcBin className="icon" />
                                            <span>delete</span>
                                        </button>
                                        <button
                                            className="menu-item"
                                            onClick={() => showDetails(value)}
                                        >
                                            <IcAbout className="icon" />
                                            <span>Details</span>
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

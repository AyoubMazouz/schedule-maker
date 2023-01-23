import React from "react";
import {
    IcBin,
    IcDelete,
    IcDownload,
    IcExport,
    IcPlus,
} from "../../components/icons";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/usePublish";

const Publish = () => {
    const { publishDocument, getPublishedDocuments, deletePublishedDocument } =
        useSettings();
    const { setAlert, setModel } = useGlobalContext();

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [documents, setDocuments] = React.useState([]);

    React.useEffect(() => {
        getPublishedDocuments(setDocuments);
    }, []);

    const publishHandler = async () => {
        setLoading(true);
        if (file) {
            await publishDocument(file, file.name);
        }
        setLoading(false);
    };

    const deleteHandler = (id) => {
        setModel({ type: "delpubdoc", id });
    };
    return (
        <div className="space-y-2 py-2">
            <div className="mx-2 flex justify-between rounded-lg border p-2 shadow-md">
                <div className="flex items-center gap-x-4">
                    <button className="btn relative">
                        <IcPlus className="icon" />
                        <span>Open a file</span>
                        <input
                            type="file"
                            className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer opacity-0"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </button>
                    {file && (
                        <div>
                            FileName:{" "}
                            <span className="font-semibold text-primary">
                                {file.name}
                            </span>
                        </div>
                    )}
                </div>
                <button
                    disabled={!file || loading}
                    className="btn-success"
                    onClick={publishHandler}
                >
                    <IcExport className="icon" />
                    <span>Publish</span>
                </button>
            </div>
            <div className="mx-2 rounded-lg border shadow-md">
                {documents.map((doc, docIndex) => (
                    <div
                        className={`menu-item group flex justify-between gap-x-2 ${
                            docIndex % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <div className="grid grid-cols-12">
                            <div className="col-span-8">{doc.id}</div>
                            <div className="col-span-4">
                                {doc.createdAt.toDate().toDateString()}
                            </div>
                        </div>
                        <div className="flex">
                            <a href={doc.url} download target="_blank">
                                <IcDownload className="icon" />
                            </a>
                            <button onClick={(e) => deleteHandler(doc.id)}>
                                <IcBin className="icon" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Publish;

import React from "react";
import { Button } from "../../components/Button";
import {
    IcBin,
    IcDelete,
    IcDownload,
    IcExport,
    IcPlus,
} from "../../components/icons";
import MoreMenu from "../../components/MoreMenu";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/usePublish";

const Publish = () => {
    const { publishDocument, getPublishedDocuments, deletePublishedDocument } =
        useSettings();
    const { setModel } = useGlobalContext();
    const { currUser } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [documents, setDocuments] = React.useState([]);
    const [currMenu, setCurrMenu] = React.useState(null);
    const menuRef = React.useRef();

    React.useEffect(() => {
        getPublishedDocuments(currUser.uid, setDocuments);
    }, []);

    const publishHandler = async () => {
        setLoading(true);
        if (file) {
            await publishDocument(currUser.uid, file.name, file);
        }
        setLoading(false);
    };

    const downloadHandler = (url) => {
        const element = document.createElement("a");
        element.setAttribute("href", url);
        element.style.display = "none";
        element.target = "_blank";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const deleteHandler = (id) => {
        setModel({ type: "delpubdoc", id });
    };

    const showDetails = (v) => {
        const details = [
            ["id", v.id],
            ["created at", v.createdAt.toDate().toDateString()],
            ["URL", v.url],
        ];
        setModel({ type: "showDetails", details });
    };
    return (
        <div className="py-2 space-y-2">
            <div className="flex justify-between p-2 mx-2 border rounded-lg shadow-md">
                <div className="flex items-center gap-x-4">
                    <Button type="primary" text="Open" Icon={IcPlus}>
                        <input
                            type="file"
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </Button>
                    {file && (
                        <div>
                            FileName:{" "}
                            <span className="font-semibold text-primary">
                                {file.name}
                            </span>
                        </div>
                    )}
                </div>
                <Button
                    type="success"
                    text="publish"
                    onClick={publishHandler}
                    Icon={IcExport}
                    disabled={!file || loading}
                />
            </div>
            <div className="mx-2 border rounded-lg shadow-md">
                {documents.map((value, docIndex) => (
                    <div
                        className={`menu-item group flex justify-between gap-x-2 ${
                            docIndex % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <div
                            onClick={(e) => showDetails(value)}
                            className="grid grid-cols-12"
                        >
                            <div className="col-span-8">{value.id}</div>
                            <div className="col-span-4">
                                {value.createdAt.toDate().toDateString()}
                            </div>
                        </div>
                        <MoreMenu
                            menuId={`publish:${value.id}`}
                            menuRef={menuRef}
                            currMenu={currMenu}
                            setCurrMenu={setCurrMenu}
                            options={[
                                [
                                    "download",
                                    () => downloadHandler(value.url),
                                    IcDownload,
                                ],
                                [
                                    "delete",
                                    () => deleteHandler(value.id),
                                    IcBin,
                                ],
                            ]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Publish;

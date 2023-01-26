import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import DocumentsBar from "./DocumentsBar";
import OptionsBar from "./OptionsBar";
import Table from "./Table/Index";
import { EditorContextProvider } from "../../Contexts/EditorContext";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Editor = () => {
    const { data, loadData } = useGlobalContext();
    const { currUser } = useAuth();

    const { docId } = useParams();

    React.useEffect(() => {
        document.title = `SH-Maker - Editor-${docId}`;
        loadData(currUser.uid, docId);
    }, [docId]);

    // React.useEffect(() => {
    //     if (EditorContextProvider.saved) window.onbeforeunload = null;
    //     else
    //         window.onbeforeunload = () => {
    //             const message =
    //                 "You can't leave this page with unsaved changes, if you leave changes will be lost.";
    //             setAlert({
    //                 type: "warn",
    //                 message,
    //             });
    //             return message;
    //         };
    // }, [EditorContextProvider.saved]);

    return (
        <EditorContextProvider>
            <div className="flex justify-center py-2">
                <div className="mx-2 w-full max-w-[1400px] gap-x-2 space-y-2 md:grid md:grid-cols-12">
                    <div className="border rounded-lg col-span-full">
                        <OptionsBar />
                    </div>
                    <div className="overflow-hidden border rounded-lg col-span-full md:col-span-3">
                        <div className="h-[calc(35vh-6rem)] overflow-x-hidden overflow-y-scroll md:h-[calc(100vh-5.5rem)]">
                            <DocumentsBar />
                        </div>
                    </div>
                    <div className="col-span-9 overflow-hidden border rounded-lg">
                        <div className="relative h-[65vh] space-y-2 overflow-x-hidden overflow-y-scroll p-2 md:h-[calc(100vh-5.5rem)]">
                            {data.map((_, schedualIndex) => (
                                <Table
                                    key={`table:${schedualIndex}`}
                                    {...{
                                        schedualIndex,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </EditorContextProvider>
    );
};

export default Editor;

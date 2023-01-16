import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import DocumentsBar from "./components/DocumentsBar";
import OptionsBar from "./components/OptionsBar";
import Table from "./components/Table";

const Editor = () => {
    const { data, setAlert } = useGlobalContext();
    const [saved, setSaved] = React.useState(true);
    const [fusionMode, setFusionMode] = React.useState(true);

    React.useEffect(() => {
        if (saved) window.onbeforeunload = null;
        else
            window.onbeforeunload = () => {
                const message =
                    "You can't leave this page with unsaved changes, if you leave changes will be lost.";
                setAlert({
                    type: "warn",
                    message,
                });
                return message;
            };
    }, [saved]);

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[1400px] gap-x-2 space-y-2 md:grid md:grid-cols-12">
                <div className="col-span-full rounded-lg border-2 border-dark/25">
                    <OptionsBar
                        {...{ saved, setSaved, fusionMode, setFusionMode }}
                    />
                </div>
                <div className="col-span-full overflow-hidden rounded-lg border-2 border-dark/25 md:col-span-3">
                    <div className="h-[calc(35vh-11rem)] overflow-y-scroll md:h-[calc(100vh-10.2rem)]">
                        <DocumentsBar {...{ saved, setSaved }} />
                    </div>
                </div>
                <div className="col-span-9 overflow-hidden rounded-lg border-2 border-dark/25">
                    <div className="h-[65vh] space-y-6 overflow-y-scroll md:h-[calc(100vh-10.2rem)] ">
                        {data.map((_, schedualIndex) => (
                            <Table
                                {...{ setSaved, schedualIndex, fusionMode }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;

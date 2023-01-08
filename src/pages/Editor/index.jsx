import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import DocumentsBar from "./components/DocumentsBar";
import OptionsBar from "./components/OptionsBar";
import Table from "./components/Table";

const Editor = () => {
    const { data } = useGlobalContext();
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[1400px] gap-x-2 space-y-2 p-2 md:grid md:grid-cols-12">
                <div className="col-span-full rounded-lg border-2 border-dark/25">
                    <OptionsBar />
                </div>
                <div className="col-span-full overflow-hidden rounded-lg border-2 border-dark/25 md:col-span-3">
                    <div className="h-[calc(35vh-11rem)] overflow-y-scroll md:h-[calc(100vh-10.2rem)]">
                        <DocumentsBar />
                    </div>
                </div>
                <div className="col-span-9 overflow-hidden rounded-lg border-2 border-dark/25">
                    <div className="h-[65vh] space-y-6 overflow-y-scroll md:h-[calc(100vh-10.2rem)] ">
                        {data.map((_, schedualIndex) => (
                            <Table schedualIndex={schedualIndex} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;

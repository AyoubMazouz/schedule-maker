import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useEditor from "../../hooks/useEditor";
import { Button } from "../Button";
import { IcCancel, IcEx, IcTrue } from "../icons";

const Exit = () => {
    const { setModel, name, data, setAlert } = useGlobalContext();
    const { addNewDocument } = useEditor();

    const navigate = useNavigate();

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`rounded-lg border-2 border-dark/25 bg-light p-4 text-center shadow-lg`}
            >
                <div className="">Do you want to save before exiting?</div>
                <div className="flex mt-4 gap-x-6">
                    <Button
                        text="Yes"
                        type="success"
                        onClick={async () => {
                            setModel(null);
                            navigate("/documents");
                            await addNewDocument(data, name);
                            setAlert({
                                type: "success",
                                message: "Document has been saved!",
                            });
                        }}
                        Icon={IcTrue}
                    />
                    <Button
                        text="No"
                        onClick={() => {
                            setModel(null);
                            navigate("/documents");
                        }}
                        Icon={IcEx}
                    />
                    <Button
                        text="Cancel"
                        onClick={() => setModel(null)}
                        Icon={IcCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default Exit;

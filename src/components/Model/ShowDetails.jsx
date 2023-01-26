import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { Button } from "../Button";
import { IcEx } from "../icons";

const ShowDetails = () => {
    const { model, setModel } = useGlobalContext();
    return (
        <>
            <div>
                {model.details.map(([key, value], index) => (
                    <div
                        key={key}
                        className={`grid grid-cols-2 px-2 py-1 ${
                            index % 2 === 0 && "bg-dark/5"
                        }`}
                    >
                        <span className="text-left max-w-1/2">{key}:</span>
                        <span className="font-semibold text-right max-w-1/2 text-primary">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
            <div className="model-btn-container">
                <Button
                    text="Close"
                    onClick={() => setModel(null)}
                    Icon={IcEx}
                />
            </div>
        </>
    );
};

export default ShowDetails;

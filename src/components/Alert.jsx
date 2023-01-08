import React from "react";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { IcRemove } from "./icons";

const Alert = () => {
    const { alert, setAlert } = useGlobalContext();

    if (!alert) return null;

    return (
        <div className="fixed top-[4rem] left-[50%] z-50 w-full max-w-[1200px] translate-x-[-50%] px-4">
            <div
                className={`alert-${alert.type} w-full} relative rounded-lg  border-2 py-4 pl-6 pr-12 text-center`}
            >
                <div className="">{alert.message}</div>
                <button
                    className="absolute top-[0.6rem] right-[1%] cursor-pointer"
                    onClick={() => setAlert(null)}
                >
                    <IcRemove className="icon text-4xl transition-all duration-300 hover:rotate-180 hover:scale-[1.1]" />
                </button>
            </div>
        </div>
    );
};

export default Alert;

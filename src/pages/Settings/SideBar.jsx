import React from "react";
import { Link } from "react-router-dom";
import { IcLabels, IcPublish, IcAbout } from "../../components/icons";
import { useGlobalContext } from "../../Contexts/GlobalContext";

const SideBar = ({ tabsLs, saved }) => {
    const { setAlert } = useGlobalContext();

    const icons = [
        <IcLabels className="icon" />,
        <IcPublish className="icon" />,
        <IcAbout className="icon" />,
    ];

    return (
        <div className="flex flex-col">
            {tabsLs.map((tab, index) =>
                saved ? (
                    <Link
                        key={tab}
                        to={`/settings/${tab}`}
                        className="menu-item"
                    >
                        {icons[index]}
                        <span>{tab}</span>
                    </Link>
                ) : (
                    <button
                        key={tab}
                        className="menu-item"
                        onClick={() =>
                            setAlert({
                                type: "warn",
                                message:
                                    "You have unsaved changes, please save or discard the changes before you leave this page.",
                            })
                        }
                    >
                        {icons[index]}
                        <span>{tab}</span>
                    </button>
                )
            )}
        </div>
    );
};

export default SideBar;

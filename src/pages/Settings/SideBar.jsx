import React from "react";
import { Link } from "react-router-dom";
import { IcLabels, IcPublish, IcAbout } from "../../components/icons";

const SideBar = ({ tabsLs }) => {
    const icons = [
        <IcLabels className="icon" />,
        <IcPublish className="icon" />,
        <IcAbout className="icon" />,
    ];
    return (
        <div className="flex flex-col">
            {tabsLs.map((tab, index) => (
                <Link to={`/settings/${tab}`} className="menu-item">
                    {icons[index]}
                    <span>{tab}</span>
                </Link>
            ))}
        </div>
    );
};

export default SideBar;

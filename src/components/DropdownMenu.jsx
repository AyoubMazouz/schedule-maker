import React from "react";
import { IcDown } from "./icons";

export const DropdownMenu = ({
    menuRef,
    currMenu,
    setCurrMenu,
    text,
    options,
    type = "secondary",
    MenuIcon = IcDown,
}) => {
    React.useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setCurrMenu(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);
    return (
        <div>
            <button
                className={`btn-${type} relative`}
                onClick={() => setCurrMenu(text)}
            >
                <MenuIcon className="icon" />
                <span>{text}</span>
            </button>
            {currMenu === text && (
                <div ref={menuRef} className="menu top-[96%] left-[1%]">
                    {options.map((Option) => {
                        const [text, callback, Icon] = Option;
                        if (React.isValidElement(Option)) return <Option />;
                        return (
                            <button
                                className="menu-item "
                                onClick={(e) => callback(e)}
                            >
                                <Icon className="icon" />
                                <span>{text}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
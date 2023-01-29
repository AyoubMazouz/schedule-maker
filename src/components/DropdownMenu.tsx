import React from "react";
import { IcDown } from "../helpers/icons";

interface Type {
  menuRef: React.RefObject<HTMLDivElement>;
  currMenu: string | null;
  setCurrMenu: React.Dispatch<React.SetStateAction<string | null>>;
  text: string;
  options: any[];
  type?: "primary" | "secondary" | "success" | "warn" | "danger";
  MenuIcon?: any;
}

export const DropdownMenu: React.FC<Type> = ({
  menuRef,
  currMenu,
  setCurrMenu,
  text,
  options,
  type = "secondary",
  MenuIcon = IcDown,
}) => {
  React.useEffect(() => {
    function handleClickOutside(e: any) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setCurrMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          {options.map((Option: any, index) => {
            if (React.isValidElement(Option))
              return <div key={`text:${index}`}>{Option}</div>;
            const [text, callback, Icon, disabled] = Option;
            return (
              <button
                key={text}
                disabled={disabled}
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
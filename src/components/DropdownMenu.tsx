import React from "react";
import { IcDown } from "../helpers/icons";

interface Type {
  menuRef: React.RefObject<HTMLDivElement>;
  currMenu: string | null;
  setCurrMenu: React.Dispatch<React.SetStateAction<string | null>>;
  text: string;
  options: any[];
}

export const DropdownMenu: React.FC<Type> = ({
  menuRef,
  currMenu,
  setCurrMenu,
  text,
  options,
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
        className="group relative flex cursor-pointer items-center gap-x-1 overflow-hidden rounded border-2 border-primary py-0.5 pl-4 pr-2 font-semibold capitalize text-primary shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setCurrMenu(text)}
      >
        <span>{text}</span>
        <IcDown className="mt-auto" />
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

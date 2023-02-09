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
  return (
    <div>
      <button
        className="duration-400 group relative flex max-h-[2.1rem] cursor-pointer items-center gap-x-1 overflow-hidden rounded-md border-2 border-primary py-1 px-4 capitalize shadow-md transition-all hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

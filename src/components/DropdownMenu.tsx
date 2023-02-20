import React from "react";
import { IcDown } from "../helpers/icons";

interface Type {
  menuRef: React.RefObject<HTMLDivElement>;
  currMenu: string | null;
  setCurrMenu: React.Dispatch<React.SetStateAction<string | null>>;
  text: string;
  options: any[];
  styles?: string;
}

export const DropdownMenu: React.FC<Type> = ({
  menuRef,
  currMenu,
  setCurrMenu,
  text,
  options,
  styles = "",
}) => {
  return (
    <>
      <button
        className={`duration-400 group relative cursor-pointer py-1 pl-4 capitalize transition-all hover:bg-dark/10 hover:text-primary focus:outline-none ${
          currMenu === text && "bg-dark/10 text-primary"
        } ${styles}`}
        onClick={() => setCurrMenu(text)}
      >
        <span>{text}</span>
        <IcDown className="icon mx-2 text-sm" />
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
                  className="menu-item"
                  onClick={(e) => callback(e)}
                >
                  <Icon className="icon" />
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        )}
      </button>
    </>
  );
};

import React from "react";
import { IcMore } from "../helpers/icons";

interface Type {
  menuRef: React.MutableRefObject<HTMLDivElement>;
  currMenu: string;
  setCurrMenu: React.Dispatch<React.SetStateAction<string | null>>;
  menuId: string;
  options: [
    string,
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    any
  ];
}

const MoreMenu: React.FC<Type> = ({
  menuRef,
  currMenu,
  setCurrMenu,
  menuId,
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
    <div className="relative flex gap-x-2 text-end">
      <button onClick={() => setCurrMenu(`${menuId}`)}>
        <IcMore
          className={
            currMenu === `${menuId}`
              ? "rotate-90 text-xl text-secondary transition-all duration-300"
              : "text-xl"
          }
        />
      </button>
      {currMenu === `${menuId}` && (
        <div
          ref={menuRef}
          className="absolute top-[0%] left-[0%] z-20 flex w-[12rem] translate-x-[-100%] flex-col overflow-hidden rounded-lg border-2 border-dark/50 bg-light text-dark shadow-lg"
        >
          {options.map((option) => {
            const [text, callback, Icon] = option;
            return (
              <button
                key={`${menuId}:${text}`}
                className="flex items-center w-full p-2 transition-all duration-100 ease-in-out border-b-2 cursor-pointer gap-x-2 border-dark/50 text-start hover:bg-primary hover:text-light disabled:cursor-not-allowed disabled:bg-secondary disabled:line-through disabled:hover:text-dark"
                onClick={(e) => {
                  callback(e);
                  setCurrMenu(null);
                }}
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

export default MoreMenu;

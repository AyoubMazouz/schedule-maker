import React from "react";
import { IcDown, IcNotAllowed, IcTrue } from "../helpers/icons";

interface SelectType {
  (
    label: any,
    values: string[],
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    menuRef: any,
    setCurrMenu: React.Dispatch<React.SetStateAction<string | null>>,
    currMenu: string,
    value?: string,
    notRecommended?: string[],
    recommended?: string[],
    styles?: string
  ): JSX.Element;
}
interface OptionType {
  (text: any, onChange: Function): JSX.Element;
}

const CurrOption: OptionType = ({ text, onChange }) => (
  <button
    onClick={() => onChange(text)}
    className="menu-item bg-primary text-light"
  >
    <div className="w-2 h-1 rounded-lg bg-light" />
    {text}
  </button>
);
const DefOption: OptionType = ({ text, onChange }) => (
  <button onClick={() => onChange(text)} className="menu-item">
    <div className="w-2 h-1 rounded-lg bg-dark" />
    {text}
  </button>
);
const RecOption: OptionType = ({ text, onChange }) => (
  <button onClick={() => onChange(text)} className="menu-item text-emerald-600">
    <div className="w-2 h-1 rounded-lg bg-emerald-600" />
    {text}
  </button>
);
const NotOption: OptionType = ({ text, onChange }) => (
  <button className="text-red-600 menu-item hover:text-red-600" disabled>
    <div className="w-2 h-1 bg-red-600 rounded-lg" />
    {text}
  </button>
);

const Label = ({ label }: { label: string[] }) => {
  return (
    <div className="absolute bottom-[20%] left-[50%] z-10 translate-x-[-50%] translate-y-[100%] rounded-md bg-light py-0.5 px-2 text-center text-xs capitalize text-dark opacity-0 shadow-md transition-all duration-500 group-hover:bottom-[-18%] group-hover:opacity-100">
      {label}
    </div>
  );
};

export const Select: SelectType = ({
  label,
  values,
  onChange,
  menuRef,
  currMenu,
  setCurrMenu,
  value = "",
  notRecommended = [],
  recommended = [],
  styles = "",
}) => {
  return (
    <>
      <button
        onClick={() => setCurrMenu(label)}
        className={`group relative rounded-md border-[1px] border-dark/50 py-1 pl-4 shadow-md hover:bg-dark/10 hover:text-primary focus:outline-none ${
          currMenu === label ? "bg-dark/10" : ""
        } ${styles}`}
      >
        {label ? <Label label={label} /> : null}
        <span>{value ? value : label}</span>
        <IcDown className="mx-2 text-sm icon" />
        {currMenu === label && (
          <div className="menu top-[112%] left-[50%] max-w-[9rem] translate-x-[-50%]">
            <div
              ref={menuRef}
              className="max-h-[22rem] overflow-y-scroll text-sm"
            >
              {recommended.map((text: string) => (
                <RecOption {...{ text, onChange }} />
              ))}
              {values.map((text: string) =>
                text === value ? (
                  <CurrOption {...{ text, onChange }} />
                ) : (
                  <DefOption {...{ text, onChange }} />
                )
              )}
              {notRecommended.map((text: string) => (
                <NotOption {...{ text, onChange }} />
              ))}
            </div>
          </div>
        )}
      </button>
    </>
  );
};

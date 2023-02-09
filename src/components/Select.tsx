import React from "react";

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
    {text}
  </button>
);
const DefOption: OptionType = ({ text, onChange }) => (
  <button onClick={() => onChange(text)} className="menu-item">
    {text}
  </button>
);
const RecOption: OptionType = ({ text, onChange }) => (
  <button
    onClick={() => onChange(text)}
    className="menu-item bg-emerald-600 text-white"
  >
    {text}
  </button>
);
const NotOption: OptionType = ({ text, onChange }) => (
  <button className="menu-item text-white disabled:bg-red-600" disabled>
    {text}
  </button>
);
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
    <div className="relative">
      <button
        onClick={() => setCurrMenu(label)}
        className={`rounded-md border-2 border-dark/50 py-1 px-4 shadow-md ${styles}`}
      >
        {value ? value : label}
      </button>
      {currMenu === label && (
        <div className="menu top-[112%] left-[50%] translate-x-[-50%]">
          <div
            ref={menuRef}
            className="max-h-[22rem] overflow-y-scroll text-base"
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
    </div>
  );
};

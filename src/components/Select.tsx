import React from "react";

interface SelectType {
  (
    label: any,
    values: string[],
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    value?: string,
    notRecommended?: string[],
    recommended?: string[],
    styles?: string
  ): JSX.Element;
}

export const Select: SelectType = ({
  label,
  values,
  onChange,
  value = "",
  notRecommended = [],
  recommended = [],
  styles = "",
}) => {
  const CurrOption = ({ text }: { text: string }) => (
    <option className="text-white bg-primary" value={text}>
      {text}
    </option>
  );
  const DefOption = ({ text }: { text: string }) => (
    <option value={text}>{text}</option>
  );
  const RecOption = ({ text }: { text: string }) => (
    <option className="text-white bg-emerald-600" value={text}>
      {text}
    </option>
  );
  const NotOption = ({ text }: { text: string }) => (
    <option disabled value={text} className="text-white bg-red-600">
      {text}
    </option>
  );
  return (
    <select
      name={label}
      className={`input cursor-pointer ${styles}`}
      value={value}
      onChange={(e) => onChange(e)}
    >
      <option value="">{label}...</option>
      {recommended.map((text: string) => (
        <RecOption text={text} />
      ))}
      {values.map((text: string) =>
        text === value ? <CurrOption text={text} /> : <DefOption text={text} />
      )}
      {notRecommended.map((text: string) => (
        <NotOption text={text} />
      ))}
    </select>
  );
};

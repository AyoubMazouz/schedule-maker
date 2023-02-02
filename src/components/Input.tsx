import React from "react";

interface Type {
  type: "text" | "password" | "email" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  labelStyle?: string;
  inputStyle?: string;
}

export const Input = ({
  type,
  value,
  onChange,
  placeholder = "",
  label = "",
  disabled = false,
  labelStyle = "",
  inputStyle = "",
}: Type) => {
  return (
    <div className="flex flex-col gap-y-1">
      {label ? (
        <label htmlFor={label} className={`${labelStyle} capitalize`}>
          {label}:
        </label>
      ) : null}
      <input
        className={`${inputStyle} max-h-[1.75rem] rounded bg-light px-2 py-1 font-semibold ring-2 ring-dark/50 focus:text-primary focus:outline-none focus:ring-primary`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

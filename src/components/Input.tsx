import React from "react";

interface Type {
  type: "text" | "password" | "email" | "number" | "textarea" | "tel";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  labelStyle?: string;
  inputStyle?: string;
}

export const Input = ({
  type,
  value,
  onChange,
  placeholder = "",
  label = "",
  error = "",
  disabled = false,
  required = false,
  labelStyle = "",
  inputStyle = "",
}: Type) => {
  return (
    <div className="flex flex-col gap-y-1">
      {label ? (
        <label htmlFor={label} className={`${labelStyle} capitalize`}>
          <span>{label}:</span>
          {required ? <span className="text-red-600">*</span> : null}
        </label>
      ) : null}
      {type === "textarea" ? (
        <textarea
          className={`${inputStyle} max-h-[3rem] rounded bg-light px-2 py-1 font-semibold ring-2 ring-dark/50 focus:text-primary focus:outline-none focus:ring-primary`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        ></textarea>
      ) : (
        <input
          className={`${inputStyle} max-h-[1.75rem] rounded bg-light px-2 py-1 font-semibold ring-2 ring-dark/50 focus:text-primary focus:outline-none focus:ring-primary`}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {error ? <div className="text-red-600">{error}</div> : null}
    </div>
  );
};

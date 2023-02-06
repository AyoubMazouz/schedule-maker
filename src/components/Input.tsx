import React from "react";

interface Type {
  type: "text" | "password" | "email" | "number" | "textarea" | "tel";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  label?: string;
  Icon?: any;
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
  Icon = null,
  error = "",
  disabled = false,
  required = false,
  labelStyle = "",
  inputStyle = "",
}: Type) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <div className="flex flex-col gap-y-1">
      {/* Label. */}
      {label ? (
        <label htmlFor={label} className={`${labelStyle} capitalize`}>
          <span>{label}:</span>
          {required ? <span className="text-red-600">*</span> : null}
        </label>
      ) : null}
      {/* TextArea Or TextField. */}
      {type === "textarea" ? (
        <div
          className={`${focus && "ring-primary"} ${
            error && "ring-red-600"
          } flex h-[4rem] overflow-hidden rounded ring-2 ring-dark/50`}
        >
          {Icon ? (
            <div className="grid h-full w-[2.8rem] place-items-center bg-dark/10">
              <Icon
                className={`icon cursor-default ${focus && "text-primary"} ${
                  error && "text-red-600"
                }`}
              />
            </div>
          ) : null}
          <textarea
            className={`${inputStyle} w-full bg-light px-2 py-1 font-semibold focus:text-primary focus:outline-none`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          ></textarea>
        </div>
      ) : (
        <div
          className={`${focus && "ring-primary"} ${
            error && "ring-red-600"
          } flex h-[2rem] overflow-hidden rounded ring-2 ring-dark/50`}
        >
          {Icon ? (
            <div className="grid h-full w-[2.8rem] place-items-center bg-dark/10">
              <Icon
                className={`icon cursor-default ${focus && "text-primary"} ${
                  error && "text-red-600"
                }`}
              />
            </div>
          ) : null}
          <input
            className={`${inputStyle} w-full bg-light px-2 py-1 font-semibold focus:text-primary focus:outline-none`}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </div>
      )}
      {/* Error. */}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
    </div>
  );
};

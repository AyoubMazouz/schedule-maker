import React from "react";

interface ButtonType {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  Icon?: any;
  text?: string;
  trigger?: boolean;
  type?: "primary" | "secondary" | "success" | "warn" | "danger";
  children?: React.ReactNode;
  disabled?: boolean;
  label?: any[];
  styles?: string;
}

const base =
  "rounded-sm shadow-md py-1 capitalize cursor-pointer pr-4 pl-3 disabled:opacity-50 flex gap-x-1 items-center disabled:cursor-not-allowed transition-all duration-400 overflow-hidden group relative max-h-[2.1rem] border-[1px] hover:text-white disabled:line-through focus:outline-none";
const btn = {
  primary: `${base} text-primary border-primary hover:bg-primary text-white`,
  secondary: `${base} text-dark border-dark hover:border-primary hover:text-primary`,
  success: `${base} border-emerald-600 text-emerald-600 hover:bg-emerald-600`,
  warn: `${base} border-orange-600 text-orange-600 hover:bg-orange-600`,
  danger: `${base} border-red-600 text-red-600 hover:bg-red-600`,
};

export const Button: React.FC<ButtonType> = ({
  Icon = null,
  onClick = (e) => e,
  text = "",
  trigger = false,
  type = "secondary",
  children = null,
  disabled = false,
  label = [],
  styles = "",
}) => {
  if (!text)
    return (
      <button
        className={`group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm transition-all duration-300 hover:bg-dark/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${
          disabled ? "hover:text-dark" : "hover:text-primary"
        } ${trigger ? "bg-dark/10" : ""}`}
        onClick={(e) => onClick(e)}
        disabled={disabled}
      >
        {Icon ? (
          <Icon
            className={`icon ${disabled && "cursor-not-allowed"}`}
            disabled={disabled}
          />
        ) : null}
        {label ? <Label label={label} /> : null}
      </button>
    );
  return (
    <button
      disabled={disabled}
      className={`${btn[type]} ${styles}`}
      onClick={(e) => onClick(e)}
    >
      {children}
      {Icon ? (
        <Icon className={`icon ${disabled && "cursor-not-allowed"}`} />
      ) : null}
      <span>{text}</span>
    </button>
  );
};

const Label = ({ label }: { label: any[] }) => {
  return (
    <div className="absolute bottom-[20%] left-[50%] z-10 h-0 max-w-[300px] translate-x-[-50%] translate-y-[100%] overflow-hidden rounded-sm bg-light py-0.5 px-2 text-center text-xs capitalize text-dark opacity-0 shadow-md transition-all duration-500 group-hover:bottom-[-18%] group-hover:h-auto group-hover:opacity-100">
      {label.map((t) => (
        <div>{t}</div>
      ))}
    </div>
  );
};

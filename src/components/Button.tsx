import React from "react";

interface ButtonType {
  Icon: any;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text?: string;
  trigger?: boolean;
  type?: "primary" | "secondary" | "success" | "warn" | "danger";
  children?: React.ReactNode;
  disabled?: boolean;
  label?: string[];
  styles?: string;
}

export const Button: React.FC<ButtonType> = ({
  Icon,
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
        className={`group relative flex h-8 w-8 items-center justify-center rounded transition-all duration-300 hover:bg-dark/25 ${
          trigger ? "bg-primary/25" : ""
        } ${styles}`}
        onClick={(e) => onClick(e)}
      >
        {label ? <Label label={label} /> : null}
        <Icon className="icon" />
      </button>
    );
  return (
    <button
      disabled={disabled}
      className={`btn-${type} ${styles} ${
        Icon ? "pl-4 pr-2" : "px-4"
      } group relative`}
      onClick={(e) => onClick(e)}
    >
      {children}
      <span>{text}</span>
      <Icon className="icon" />
    </button>
  );
};

const Label = ({ label }: { label: string[] }) => {
  return (
    <div className="absolute bottom-[20%] left-[50%] translate-x-[-50%] translate-y-[100%] rounded-md bg-light py-0.5 px-2 text-center text-xs capitalize text-dark opacity-0 shadow-md transition-all duration-500 group-hover:bottom-[-18%] group-hover:opacity-100">
      {label.map((t) => (
        <div className="whitespace-nowrap">{t}</div>
      ))}
    </div>
  );
};

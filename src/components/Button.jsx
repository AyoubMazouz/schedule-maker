import React from "react";

export const Button = ({
    Icon,
    onClick = (e) => e,
    text = "",
    trigger = null,
    type = "secondary",
    children = null,
    disabled = false,
    label = "",
}) => {
    if (!text)
        return (
            <button
                className={`group relative flex h-8 w-8 items-center justify-center rounded transition-all duration-300 hover:bg-dark/25 ${
                    trigger ? "bg-primary/25" : ""
                }`}
                onClick={(e) => onClick(e)}
            >
                {label ? <Label label={label} /> : null}
                <Icon className="icon" />
            </button>
        );
    return (
        <button
            disabled={disabled}
            className={`btn-${type} ${
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

const Label = ({ label }) => {
    return (
        <div className="absolute bottom-[20%] left-[50%] translate-x-[-50%] translate-y-[100%] rounded-md bg-light py-0.5 px-2 text-center text-xs capitalize text-dark opacity-0 shadow-md transition-all duration-500 group-hover:bottom-[-18%] group-hover:opacity-100">
            {label.map((t) => (
                <div className="whitespace-nowrap">{t}</div>
            ))}
        </div>
    );
};

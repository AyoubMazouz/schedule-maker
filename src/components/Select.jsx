import React from "react";

export const Select = ({
    onChange,
    values,
    recommended = [],
    notRecommended = [],
    label = "",
    defaultValue = "",
}) => {
    const ls = values.filter((v) => {
        if (recommended.includes(v.name)) return false;
        if (notRecommended.includes(v.name)) return false;
        return true;
    });
    return (
        <select
            name={label}
            className="input"
            value={defaultValue}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" disabled>
                {label}...
            </option>
            {recommended.map((value) => {
                const name = value?.name ? value.name : value;
                return value ? (
                    <option className="text-white bg-emerald-500" value={name}>
                        {name}
                    </option>
                ) : null;
            })}
            {ls.map((value) => {
                const name = value?.name ? value.name : value;
                return value ? (
                    <option className="" value={name}>
                        {name}
                    </option>
                ) : null;
            })}
            {notRecommended.map((value) => {
                const name = value?.name ? value.name : value;
                return value ? (
                    <option className="text-white bg-red-500" value={name}>
                        {name}
                    </option>
                ) : null;
            })}
        </select>
    );
};

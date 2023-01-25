import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();

    if (location.pathname.includes("editor")) return null;

    return (
        <div className="mt-auto text-center">
            Shcedual Maker | Developed By Mazouz.
        </div>
    );
};

export default Footer;

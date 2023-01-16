import React from "react";
import { ABOUT_APP, VERSION } from "../../constants";

const About = () => {
    return (
        <div className="space-y-3 p-2">
            <div className="relative text-lg font-semibold text-primary">
                Schedual Maker
                <span className="absolute top-0 text-xs">BETA</span>
            </div>
            <div>{ABOUT_APP}</div>
            <div className="flex h-[1.8rem] w-[9.6rem] overflow-hidden rounded-md border text-center">
                <span className="h-full w-1/2 bg-sky-600 text-white">
                    version
                </span>
                <span className="h-full w-1/2 bg-slate-200">{VERSION}</span>
            </div>
        </div>
    );
};

export default About;

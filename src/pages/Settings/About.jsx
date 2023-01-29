import React from "react";
import { IcMail } from "../../helpers/icons";
import { ABOUT_APP, MY_EMAIL, VERSION } from "../../helpers/constants";

const About = () => {
  return (
    <div className="space-y-3 p-2">
      <div className="relative text-lg font-semibold text-primary">
        Schedual Maker
        <span className="absolute top-0 text-xs">BETA</span>
      </div>
      <div>{ABOUT_APP}</div>
      <div className="flex gap-x-2 font-semibold text-primary hover:underline">
        <IcMail className="icon" />
        <a href={`mailto:${MY_EMAIL}`} traget="_blank">
          {MY_EMAIL}
        </a>
      </div>
      <div className="font-cemibold flex h-[1.4rem] w-[7.8rem] overflow-hidden rounded-md border text-center text-xs">
        <span className="h-full w-1/2 bg-sky-600 text-white">version</span>
        <span className="h-full w-1/2 bg-slate-200">{VERSION}</span>
      </div>
    </div>
  );
};

export default About;

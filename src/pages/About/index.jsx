import React from "react";
import { IcMail } from "../../helpers/icons";
import { ABOUT_APP, MY_EMAIL, VERSION } from "../../helpers/constants";
import SettingsSideBar from "../../components/SettingsSideBar";

const About = () => {
  return (
    <SettingsSideBar>
      <div className="p-2 space-y-3">
        <div className="relative text-lg font-semibold text-primary">
          Schedule Maker
          <span className="absolute top-0 text-xs">BETA</span>
        </div>
        <div>{ABOUT_APP}</div>
        <div className="flex font-semibold gap-x-2 text-primary hover:underline">
          <IcMail className="icon" />
          <a href={`mailto:${MY_EMAIL}`} traget="_blank">
            {MY_EMAIL}
          </a>
        </div>
        <div className="flex h-[1.4rem] w-[7.8rem] overflow-hidden rounded-md border text-center text-xs font-semibold">
          <span className="w-1/2 h-full text-white bg-sky-600">version</span>
          <span className="w-1/2 h-full bg-slate-200">{VERSION}</span>
        </div>
      </div>
    </SettingsSideBar>
  );
};

export default About;

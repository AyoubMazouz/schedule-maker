import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import About from "./About";
import Labels from "./Labels";
import Publish from "./Publish";
import SideBar from "./SideBar";

const Settings = () => {
    const { settingsTab } = useParams();

    const navigate = useNavigate();

    const tabs = {
        labels: <Labels />,
        publish: <Publish />,
        about: <About />,
    };

    const tabsLs = Object.keys(tabs);

    React.useEffect(() => {
        if (!tabsLs.includes(settingsTab)) {
            navigate("/settings/labels");
        }
    }, []);

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[1400px] gap-x-2 space-y-2 p-2 md:grid md:grid-cols-12">
                <div className="col-span-full overflow-hidden rounded-lg border-2 border-dark/25 md:col-span-3">
                    <div className="md:h-[calc(100vh-6.6rem)]">
                        <SideBar tabsLs={tabsLs} />
                    </div>
                </div>
                <div className="col-span-9 overflow-hidden rounded-lg border-2 border-dark/25">
                    <div className="h-[75vh] overflow-y-scroll md:h-[calc(100vh-6.6rem)] ">
                        {tabs[settingsTab]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

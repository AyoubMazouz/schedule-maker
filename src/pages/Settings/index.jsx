import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import About from "./About";
import Labels from "./Labels";
import Publish from "./Publish";
import SideBar from "./SideBar";

const Settings = () => {
    const { settingsTab } = useParams();

    const navigate = useNavigate();

    const [saved, setSaved] = React.useState(true);

    const tabs = {
        labels: <Labels {...{ saved, setSaved }} />,
        publish: <Publish {...{ saved, setSaved }} />,
        about: <About {...{ saved, setSaved }} />,
    };

    const tabsLs = Object.keys(tabs);

    React.useEffect(() => {
        document.title = `SH-Maker - Settings-${settingsTab}`;
        if (!tabsLs.includes(settingsTab)) {
            navigate("/settings/labels");
        }
    }, []);

    return (
        <div className="mx-2 flex justify-center">
            <div className="grid w-full max-w-[1400px] grid-cols-12 gap-2">
                <div className="col-span-full overflow-hidden rounded-lg border-2 border-dark/25 md:col-span-3">
                    <div className="md:h-[calc(100vh-6.6rem)]">
                        <SideBar {...{ tabsLs, setSaved, saved }} />
                    </div>
                </div>
                <div className="col-span-full overflow-hidden rounded-lg border-2 border-dark/25 md:col-span-9">
                    <div className="h-[75vh] overflow-y-scroll md:h-[calc(100vh-6.6rem)] ">
                        {tabs[settingsTab]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import Events from "./Events";
import Faculties from "./Faculties";
import OptionBar from "./OptionBar";
import Rooms from "./Rooms";
import Trainers from "./Trainers";

const Labels = ({ saved, setSaved }) => {
    const { getLabels } = useSettings();
    const { setAlert } = useGlobalContext();
    const [labelsData, setLabelsData] = React.useState({
        trainers: [],
        rooms: [],
        faculties: [],
        events: [],
    });
    const menuRef = React.useRef(null);
    const [currMenu, setCurrMenu] = React.useState(null);

    React.useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setCurrMenu(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    React.useEffect(() => {
        getLabels().then((labels) => setLabelsData(labels));
    }, []);

    React.useEffect(() => {
        if (saved) window.onbeforeunload = null;
        else
            window.onbeforeunload = () => {
                const message =
                    "You can't leave this page with unsaved changes, if you leave changes will be lost.";
                setAlert({
                    type: "warn",
                    message,
                });
                return message;
            };
    }, [saved]);

    return (
        <div className="p-2 space-y-2">
            <OptionBar
                {...{
                    menuRef,
                    currMenu,
                    setCurrMenu,
                    saved,
                    setSaved,
                    labelsData,
                    setLabelsData,
                }}
            />
            <div>Faculties:</div>
            <Faculties
                {...{
                    currMenu,
                    setCurrMenu,
                    menuRef,
                    setSaved,
                    labelsData,
                    setLabelsData,
                }}
            />
            <div>Rooms:</div>
            <Rooms
                {...{
                    currMenu,
                    setCurrMenu,
                    menuRef,
                    setSaved,
                    labelsData,
                    setLabelsData,
                }}
            />
            <div>Trainers:</div>
            <Trainers
                {...{
                    currMenu,
                    setCurrMenu,
                    menuRef,
                    setSaved,
                    labelsData,
                    setLabelsData,
                }}
            />
            <div>Events:</div>
            <Events
                {...{
                    currMenu,
                    setCurrMenu,
                    menuRef,
                    setSaved,
                    labelsData,
                    setLabelsData,
                }}
            />
        </div>
    );
};

export default Labels;

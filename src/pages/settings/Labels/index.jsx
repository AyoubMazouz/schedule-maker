import React from "react";
import SettingsLayout from "../SettingsLayout";
import { useAuth } from "../../../Contexts/AuthContext";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import Events from "./Events";
import Levels from "./Levels";
import LabelsNavBar from "./LabelsNavBar";
import Rooms from "./Rooms";
import Trainers from "./Trainers";
import usePageTitle from "../../../hooks/usePageTitle";

const Labels = () => {
	usePageTitle("Labels");

	const { setAlert, labelsData, loadLabelsData } = useGlobalContext();
	const { currUser } = useAuth();
	const menuRef = React.useRef(null);
	const [currMenu, setCurrMenu] = React.useState(null);

	const [saved, setSaved] = React.useState(true);
	const [search, setSearch] = React.useState("");

	React.useEffect(() => {
		loadLabelsData(currUser.username);
	}, []);

	React.useEffect(() => {
		if (saved) window.onbeforeunload = null;
		else
			window.onbeforeunload = () => {
				const message = setAlert(
					"warn",
					"You can't leave this page with unsaved changes, if you leave changes will be lost.",
				);
				return message;
			};
	}, [saved]);

	return (
		<SettingsLayout {...{ saved }}>
			<LabelsNavBar
				{...{
					menuRef,
					currMenu,
					setCurrMenu,
					saved,
					setSaved,
					search,
					setSearch,
				}}
			/>
			<Levels
				{...{
					currMenu,
					setCurrMenu,
					menuRef,
					setSaved,
					labelsData,
					search,
				}}
			/>
			<Rooms
				{...{
					currMenu,
					setCurrMenu,
					menuRef,
					setSaved,
					search,
				}}
			/>
			<Trainers
				{...{
					currMenu,
					setCurrMenu,
					menuRef,
					setSaved,
					search,
				}}
			/>
			<Events
				{...{
					currMenu,
					setCurrMenu,
					menuRef,
					setSaved,
					search,
				}}
			/>
		</SettingsLayout>
	);
};

export default Labels;

import React from "react";
import { Link } from "react-router-dom";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
// Helpers.
import { IcLabels, IcPublish, IcAbout, IcUser } from "../../helpers/icons";

interface Type {
	saved?: boolean;
	children?: any;
}

const SettingsLayout: React.FC<Type> = ({ saved = true, children = null }) => {
	const { setAlert } = useGlobalContext();

	const links = [
		["profile", IcUser],
		["labels", IcLabels],
		["publish", IcPublish],
		["about", IcAbout],
	];

	return (
		<div className="flex w-full">
			<div className="w-full min-w-[220px] max-w-[300px] border-r-[1px] border-dark/50">
				{links.map(([label, Icon]: any) =>
					saved ? (
						<Link key={label} to={`/settings/${label}`} className="py-2 menu-item">
							<Icon className="icon" />
							<span>{label}</span>
						</Link>
					) : (
						<button
							key={label}
							className="py-2 menu-item"
							onClick={() =>
								setAlert(
									"warn",
									"You have unsaved changes, please save or discard the changes before you leave this page.",
								)
							}>
							<Icon className="icon" />
							<span>{label}</span>
						</button>
					),
				)}
			</div>
			<div className="relative h-[calc(100vh-3rem)] w-full space-y-2 overflow-y-scroll p-2">
				{children}
			</div>
		</div>
	);
};

export default SettingsLayout;

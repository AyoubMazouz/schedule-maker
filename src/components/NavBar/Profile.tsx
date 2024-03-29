import React from "react";
import { User } from "../../helpers/types";
import { IcDown, IcLogout, IcSettings } from "../../helpers/icons";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useAuth } from "../../Contexts/AuthContext";
import { useUser } from "../../hooks/useUser";

interface Type {
	menuRef: React.RefObject<HTMLDivElement>;
	currMenu: string | null;
	setCurrMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Profile: React.FC<Type> = ({ menuRef, currMenu, setCurrMenu }) => {
	const { setAlert } = useGlobalContext();
	const { currUser } = useAuth();
	const { signOut } = useUser();

	const logoutHandler = () => {
		signOut();
		setAlert("success", `Goodbye "${currUser.email}"`);
	};

	return (
		<div className="relative h-full">
			<button
				onClick={() => setCurrMenu("PRF_MENU")}
				className="flex items-center h-full px-3 gap-x-2 hover:bg-dark/10">
				<img
					className={`aspect-1 h-8 cursor-pointer overflow-hidden rounded-full opacity-90 shadow-md transition-all duration-300 focus:outline-none ${
						currMenu === "PRF_MENU" && "border"
					}`}
					src={currUser.img}
				/>
				<IcDown />
			</button>
			{currMenu === "PRF_MENU" && (
				<div ref={menuRef} className="menu top-[110%] right-[0%] w-[12rem]">
					<Link
						to={"/settings/profile"}
						className="menu-item group border-b-[1px] border-dark/50 py-2">
						<img src={currUser.img} className="aspect-1 w-[3.6rem] rounded-md shadow" />
						<div className="-space-y-1 font-semibold">
							<div className="text-lg">@{currUser.username}</div>
							<div className="text-xs underline text-primary group-hover:text-light">
								Manage profile
							</div>
						</div>
					</Link>
					<Link to="/settings/labels" className="menu-item">
						<IcSettings className="icon" />
						Settings
					</Link>
					<button
						className="text-red-600 menu-item hover:bg-red-600 hover:text-white"
						onClick={logoutHandler}>
						<IcLogout className="icon" />
						Sign out
					</button>
				</div>
			)}
		</div>
	);
};

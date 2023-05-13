import React from "react";
import { Link, useLocation } from "react-router-dom";
// Contexts.
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
// Components.
import { Button } from "../Button";
import { IcLogin } from "../../helpers/icons";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

const NavBar = () => {
	const { setModel } = useGlobalContext();
	const { currUser } = useAuth();

	const location = useLocation();

	const menuRef = React.useRef<HTMLDivElement>(null);
	const [currMenu, setCurrMenu] = React.useState<string | null>(null);

	React.useEffect(() => {
		function handleClickOutside(e: any) {
			if (menuRef.current && !menuRef.current.contains(e.target)) setCurrMenu(null);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [menuRef]);

	if (location.pathname.includes("editor")) return null;

	return (
		<nav className="flex items-center justify-between h-12 px-6 shadow-sm border-b- border-dark/50">
			<Logo />
			<div className="flex items-center h-full gap-x-6">
				{currUser ? (
					<Profile {...{ menuRef, currMenu, setCurrMenu }} />
				) : (
					<Button
						type="success"
						text="Login"
						onClick={() => setModel({ type: "login" })}
						Icon={IcLogin}
					/>
				)}
			</div>
		</nav>
	);
};

export default NavBar;

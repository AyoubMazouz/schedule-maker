import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

export const Logo = () => {
	const { currUser } = useAuth();
	return (
		<Link to={currUser ? "/documents" : "/"} className="px-3 text-xl uppercase">
			Schedule {"  "}
			<span className="font-bold text-primary">Maker </span>
		</Link>
	);
};

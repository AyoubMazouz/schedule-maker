import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { IcLogin, IcLogout } from "./icons";

const NavBar = () => {
    const { setModel, setAlert } = useGlobalContext();
    const { logout, currUser } = useAuth();

    const logoutHandler = async () => {
        logout();
        setAlert({ type: "success", message: `Goodbye "${currUser.email}"` });
    };
    return (
        <nav className="flex justify-center">
            <div className="flex h-[3.3rem] w-full max-w-[1400px] items-center justify-between px-2">
                <div className="text-xl uppercase">
                    <Link to="/">
                        Schedual{" "}
                        <span className="font-bold text-primary">Maker</span>
                    </Link>
                </div>
                <ul className="flex items-center gap-x-6">
                    <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/documents">1.Editor</Link>
                    </li>
                    <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/settings">3.Settings</Link>
                    </li>
                    {/* <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/contact">2.Contact</Link>
                    </li> */}
                    <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        {currUser ? (
                            <button
                                className="btn-danger"
                                onClick={logoutHandler}
                            >
                                <IcLogout className="icon" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <button
                                className="btn-success"
                                onClick={(e) => setModel({ type: "login" })}
                            >
                                <IcLogin className="icon" />
                                <span>Login</span>
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;

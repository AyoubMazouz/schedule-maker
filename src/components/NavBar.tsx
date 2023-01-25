import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { Button } from "./Button";
import { IcEditor, IcLogin, IcLogout, IcSettings } from "./icons";

const NavBar = () => {
    const { setModel, setAlert } = useGlobalContext();
    const { logout, currUser } = useAuth();

    const location = useLocation();

    const logoutHandler = async () => {
        logout();
        setAlert({ type: "success", message: `Goodbye "${currUser.email}"` });
    };

    if (location.pathname.includes("editor")) return null;

    return (
        <nav className="flex justify-center">
            <div className="m-2 flex h-[3.3rem] w-full max-w-[1400px] items-center justify-between rounded-lg border p-2 shadow-md">
                <div className="text-xl uppercase">
                    <Link to="/">
                        Schedual{" "}
                        <span className="font-bold text-primary">Maker</span>
                    </Link>
                </div>
                <ul className="flex items-center gap-x-6">
                    <li className="font-semibold transition-all duration-300 capitalized hover:text-secondary">
                        <Link
                            to="/documents"
                            className="flex items-center gap-x-1"
                        >
                            <IcEditor className="icon" />
                            <span>Editor</span>
                        </Link>
                    </li>
                    <li className="font-semibold transition-all duration-300 capitalized hover:text-secondary">
                        <Link
                            to="/settings"
                            className="flex items-center gap-x-1"
                        >
                            <IcSettings className="icon" />
                            <span>Settings</span>
                        </Link>
                    </li>
                    {/* <li className="font-semibold transition-all duration-300 capitalized hover:text-secondary">
                        <Link to="/contact">2.Contact</Link>
                    </li> */}
                    <li className="font-semibold transition-all duration-300 capitalized hover:text-secondary">
                        {currUser ? (
                            <Button
                                type="danger"
                                text="Logout"
                                onClick={logoutHandler}
                                Icon={IcLogout}
                            />
                        ) : (
                            <Button
                                type="success"
                                text="Login"
                                onClick={() => setModel({ type: "login" })}
                                Icon={IcLogin}
                            />
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;

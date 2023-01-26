import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { Button } from "../Button";
import { IcDown, IcEditor, IcLogin, IcLogout, IcSettings } from "../icons";
import { Logo } from "./Logo";

const NavBar = () => {
    const { setModel, setAlert } = useGlobalContext();
    const { logout, currUser } = useAuth();

    const location = useLocation();

    const menuRef = React.useRef();
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

    const logoutHandler = async () => {
        logout();
        setAlert({ type: "success", message: `Goodbye "${currUser.email}"` });
    };

    if (location.pathname.includes("editor")) return null;

    return (
        <nav className="flex justify-center">
            <div className="m-2 flex h-[3.3rem] w-full max-w-[1400px] items-center justify-between rounded-lg border p-2 shadow-md">
                <Logo />
                <div className="flex items-center gap-x-6">
                    <Link
                        to="/documents"
                        className="flex items-center font-semibold transition-all duration-300 capitalized gap-x-1 hover:text-secondary"
                    >
                        <IcEditor className="icon" />
                        <span>Editor</span>
                    </Link>
                    <div className="relative font-semibold transition-all duration-300 capitalized hover:text-secondary">
                        {currUser ? (
                            <>
                                <div
                                    className={`${
                                        currMenu === "prfMenu" && "border"
                                    } h-[2.25rem] w-[2.25rem] cursor-pointer overflow-hidden rounded-full opacity-90 shadow-md transition-all duration-300 hover:opacity-100`}
                                    onClick={(e) => setCurrMenu("prfMenu")}
                                >
                                    <img
                                        className="aspect-1"
                                        src="/assets/default-profile.png"
                                    />
                                </div>
                                {currMenu === "prfMenu" && (
                                    <div
                                        ref={menuRef}
                                        className="menu top-[110%] right-[0%]"
                                    >
                                        <Link
                                            to="/settings"
                                            className="menu-item"
                                        >
                                            <IcSettings className="icon" />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            className="text-red-600 menu-item hover:bg-red-600 hover:text-white"
                                            onClick={(e) => logout()}
                                        >
                                            <IcLogout className="icon" />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Button
                                type="success"
                                text="Login"
                                onClick={() => setModel({ type: "login" })}
                                Icon={IcLogin}
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
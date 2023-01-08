import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="flex justify-center">
            <div className="flex h-[3.3rem] w-full max-w-[1400px] items-center justify-between px-2">
                <div className="text-xl uppercase">
                    <Link to="/">
                        Schedual{" "}
                        <span className="font-bold text-primary">Maker</span>
                    </Link>
                </div>
                <ul className="flex gap-x-6">
                    <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/editor/documents">1.Editor</Link>
                    </li>
                    <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/settings">3.Settings</Link>
                    </li>
                    {/* <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/contact">2.Contact</Link>
                    </li> */}
                    {/* <li className="capitalized font-semibold transition-all duration-300 hover:text-secondary">
                        <Link to="/login">4.Login</Link>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;

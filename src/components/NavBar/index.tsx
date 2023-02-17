import React from "react";
import { Link, useLocation } from "react-router-dom";
// Contexts.
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
// Hooks.
import { useUser } from "../../hooks/useUser";
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
      if (menuRef.current && !menuRef.current.contains(e.target))
        setCurrMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  if (location.pathname.includes("editor")) return null;

  return (
    <nav className="flex h-14 items-center justify-between border-b-[1px] border-dark/50 px-2 md:px-6 lg:px-12">
      <Logo />
      <div className="flex items-center h-full gap-x-6">
        <Link
          to="/documents"
          className="relative text-lg font-semibold after:absolute after:bottom-[-8%] after:left-[50%] after:h-0 after:w-full after:translate-x-[-50%] after:rounded-lg after:bg-primary after:opacity-0 after:transition-all after:duration-300 after:content-[''] after:hover:h-[.25rem] hover:after:opacity-100"
        >
          Editor
        </Link>
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

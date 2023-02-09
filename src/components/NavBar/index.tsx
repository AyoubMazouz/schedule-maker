import React from "react";
import { Link, useLocation } from "react-router-dom";
// Contexts.
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
// Hooks.
import { useUser } from "../../hooks/useUser";
// Components.
import { Button } from "../Button";
import { IcEditor, IcLogin, IcLogout, IcSettings } from "../../helpers/icons";
import { Logo } from "./Logo";

const NavBar = () => {
  const { setModel, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { signOut } = useUser();

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

  const logoutHandler = () => {
    signOut();
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
            className="capitalized flex items-center gap-x-1 font-semibold transition-all duration-300 hover:text-secondary"
          >
            <IcEditor className="icon" />
            <span>Editor</span>
          </Link>
          <div className="capitalized relative transition-all duration-300 hover:text-secondary">
            {currUser ? (
              <>
                <div
                  className={`${
                    currMenu === "prfMenu" && "border"
                  } h-[2.25rem] w-[2.25rem] cursor-pointer overflow-hidden rounded-full opacity-90 shadow-md transition-all duration-300 hover:opacity-100`}
                  onClick={(e) => setCurrMenu("prfMenu")}
                >
                  <img className="aspect-1" src={currUser.img} />
                </div>
                {currMenu === "prfMenu" && (
                  <div ref={menuRef} className="menu top-[110%] right-[0%]">
                    <Link to={"/settings/profile"} className="menu-item group">
                      <img
                        src={currUser.img}
                        className="aspect-1 w-[3rem] rounded-md shadow"
                      />
                      <div className="-space-y-1 font-semibold">
                        <span>@{currUser.username}</span>
                        <div className="text-sm text-primary underline group-hover:text-light">
                          Manage profile
                        </div>
                      </div>
                    </Link>
                    <Link to="/settings" className="menu-item">
                      <IcSettings className="icon" />
                      <span>Settings</span>
                    </Link>
                    <button
                      className="menu-item text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={logoutHandler}
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

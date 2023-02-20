import React from "react";
import { Link } from "react-router-dom";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
// Helpers.
import { IcLabels, IcPublish, IcAbout, IcUser } from "../../helpers/icons";

const SettingsLayout = ({ saved = true, children = null }) => {
  const { setAlert } = useGlobalContext();

  const links = [
    ["profile", IcUser],
    ["users", IcUser],
    ["labels", IcLabels],
    ["publish", IcPublish],
    ["about", IcAbout],
  ];

  return (
    <div className="flex w-full">
      <div className="w-full min-w-[220px] max-w-[300px] border-r-[1px] border-dark/50">
        {links.map(([label, Icon]) =>
          saved ? (
            <Link
              key={label}
              to={`/settings/${label}`}
              className="menu-item py-2"
            >
              <Icon className="icon" />
              <span>{label}</span>
            </Link>
          ) : (
            <button
              key={label}
              className="menu-item py-2"
              onClick={() =>
                setAlert({
                  type: "warn",
                  message:
                    "You have unsaved changes, please save or discard the changes before you leave this page.",
                })
              }
            >
              <Icon className="icon" />
              <span>{label}</span>
            </button>
          )
        )}
      </div>
      <div className="relative h-[calc(100vh-3rem)] w-full space-y-2 overflow-y-scroll p-2">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;

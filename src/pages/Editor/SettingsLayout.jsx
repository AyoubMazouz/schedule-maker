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
    <div className="flex justify-center mx-2">
      <div className="grid w-full max-w-[1400px] grid-cols-12 gap-2">
        <div className="overflow-hidden border-2 rounded-lg col-span-full border-dark/50 md:col-span-3">
          <div className="md:h-[calc(100vh-6.6rem)]">
            <div className="flex flex-col">
              {links.map(([label, Icon]) =>
                saved ? (
                  <Link
                    key={label}
                    to={`/settings/${label}`}
                    className="menu-item"
                  >
                    <Icon className="icon" />
                    <span>{label}</span>
                  </Link>
                ) : (
                  <button
                    key={label}
                    className="menu-item"
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
          </div>
        </div>
        <div className="overflow-hidden border-2 rounded-lg col-span-full border-dark/50 md:col-span-9">
          <div className="h-[75vh] overflow-y-scroll md:h-[calc(100vh-6.6rem)] ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;

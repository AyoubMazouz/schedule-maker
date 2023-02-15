import React from "react";
import { Button } from "../../components/Button";
import {
  IcBin,
  IcDownload,
  IcNewDoc,
  IcCopy,
  IcCopied,
  IcPublish,
  IcHelp,
  IcDoc,
} from "../../helpers/icons";
import MoreMenu from "../../components/MoreMenu";
import { useAuth } from "../../Contexts/AuthContext";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { Link } from "react-router-dom";
import { Input } from "../../components/Input";
import usePublish from "../../hooks/usePublish";
import { getRelativeDate } from "../../helpers/util";
import SettingsSideBar from "../../components/SettingsSideBar";

const INITIAL_STATE = {
  id: "",
  file: null,
  copied: false,
  desc: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FILE":
      return {
        ...state,
        id: action.payload.value.name,
        file: action.payload.value,
      };
    case "REMOVE_FILE":
      return { ...state, file: null };
    case "COPY":
      return { ...state, copied: !state.copied };
    case "ID":
      return { ...state, id: action.payload.value };
    case "DESC":
      return { ...state, desc: action.payload.value };
    default:
      return state;
  }
};

const Publish = () => {
  const { setModel, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { publishDocument, getPublishedDocuments, loading } = usePublish();

  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const menuRef = React.useRef();
  const [currMenu, setCurrMenu] = React.useState(null);
  const [documents, setDocuments] = React.useState([]);

  React.useEffect(() => {
    getPublishedDocuments(currUser.username, setDocuments);
  }, []);

  const handlePublish = async () => {
    try {
      const res = await publishDocument(
        currUser.username,
        state.id,
        state.file,
        state.desc
      );
      if (res === "success")
        setAlert({
          type: "success",
          message: `the document "${state.id}" has been published successfully!`,
        });
    } catch (e) {
      switch (e.message) {
        case "FILE_EXISTS":
          setAlert({
            type: "warn",
            message: `The title ${state.id} already used for another document, please chose another name.`,
          });
      }
      console.log(e);
    }
  };

  const handleDownload = (url) => {
    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.style.display = "none";
    element.target = "_blank";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDetail = (v) => {
    const details = [
      ["title", v.id],
      ["owner", v.username],
      ["description", v.desc],
      ["created at", getRelativeDate(v.createdAt)],
      ["URL", v.url],
    ];
    setModel({ type: "showDetails", details });
  };

  const publishPageUrl = window.location.href.replace(
    "settings/publish",
    "publish/" + currUser.username
  );

  return (
    <SettingsSideBar>
      <div className="p-2 space-y-6">
        {/* Url. */}
        <div className="flex items-center justify-between px-3 py-2 font-semibold underline border rounded-lg shadow-md text-dark/50">
          <Link to={"/publish/" + currUser.username}>{publishPageUrl}</Link>
          <Button
            Icon={state.copied ? IcCopied : IcCopy}
            onClick={(e) => dispatch({ type: "COPY" })}
            label={state.copied ? ["copied"] : ["copy"]}
            styles="bg-primary text-white"
            disabled={state.copied}
          />
        </div>
        {/* File dialog. */}
        <div className="flex justify-between">
          <div className="flex items-center gap-x-6">
            <Button
              type="secondary"
              text={`${state.file ? state.file.name : "select file"}`}
              Icon={IcNewDoc}
              styles="py-4 text-lg"
            >
              <input
                type="file"
                className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  dispatch({
                    type: "FILE",
                    payload: { value: e.target.files[0] },
                  })
                }
              />
            </Button>
            <Button
              label={["remove file"]}
              Icon={IcBin}
              onClick={(e) => dispatch({ type: "REMOVE_FILE" })}
            />
          </div>
          <Button
            text="publish"
            type="success"
            Icon={IcPublish}
            onClick={handlePublish}
            disabled={loading}
          />
        </div>

        {state.file ? (
          <div className="space-y-3">
            <Input
              type="text"
              label="title"
              value={state.id}
              placeholder="file name..."
              onChange={(e) =>
                dispatch({ type: "ID", payload: { value: e.target.value } })
              }
            />
            <Input
              type="textarea"
              label="description"
              value={state.desc}
              placeholder="file name..."
              onChange={(e) =>
                dispatch({
                  type: "DESC",
                  payload: { value: e.target.value },
                })
              }
            />
          </div>
        ) : null}
        {/* Documents. */}
        <div className="border rounded-lg shadow-md">
          <div className="flex items-center pr-1 border-b-2 border-dark/50 bg-primary text-start text-light">
            <div className="grid w-full grid-cols-12 p-2 font-semibold">
              <div className="col-span-9">Events</div>
              <div className="hidden col-span-3 text-center md:block">
                Created At
              </div>
            </div>
            <Button Icon={IcHelp} label={["Events"]} />
          </div>
          {documents.map((value, docIndex) => (
            <div
              key={value.id}
              className={`menu-item group flex ${
                docIndex % 2 === 0 && "bg-dark/10"
              }`}
            >
              <div
                onClick={(e) => handleDetail(value)}
                className="grid w-full grid-cols-12"
              >
                <div className="flex col-span-9 gap-x-1 group-hover:underline">
                  <IcDoc className="icon" />
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {value.id}
                  </div>
                </div>
                <div className="hidden col-span-3 text-center sm:block">
                  {getRelativeDate(value.createdAt)}
                </div>
              </div>
              <MoreMenu
                menuId={`publish:${value.id}`}
                menuRef={menuRef}
                currMenu={currMenu}
                setCurrMenu={setCurrMenu}
                options={[
                  ["download", () => handleDownload(value.url), IcDownload],
                  [
                    "delete",
                    () =>
                      setModel({ type: "delpubdoc", id: value.id, documents }),
                    IcBin,
                  ],
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </SettingsSideBar>
  );
};

export default Publish;

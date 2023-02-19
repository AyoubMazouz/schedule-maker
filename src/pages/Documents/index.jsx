import React from "react";
import useEditor from "../../hooks/useEditor";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import {
  IcAbout,
  IcBin,
  IcDoc,
  IcDownload,
  IcEdit,
  IcExport,
  IcHelp,
} from "../../helpers/icons";
import DocumentsSideBar from "./DocumentsSideBar";
import useDocument from "../../hooks/useDocument";
import { usePdf } from "../../hooks/usePdf";
import MoreMenu from "../../components/MoreMenu";
import { useAuth } from "../../Contexts/AuthContext";
import { Button } from "../../components/Button";
import { getRelativeDate } from "../../helpers/util";
import usePageTitle from "../../hooks/usePageTitle";

const Documents = () => {
usePageTitle("Documents")

  const { setModel, data, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { exportDocument } = useEditor();
  const { getAllDocuments } = useDocument();
  const { exportAsPdf } = usePdf();

  const [documents, setDocuments] = React.useState([]);

  React.useEffect(() => {
    document.title = `SH-Maker - Documents`;
    getAllDocuments(currUser.username, setDocuments);
  }, []);

  const menuRef = React.useRef(null);
  const [currMenu, setCurrMenu] = React.useState(null);
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setCurrMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const deleteHandler = (name) => {
    setModel({
      type: "deldoc",
      name,
    });
    setCurrMenu(null);
  };

  const renameHandler = (value) => {
    setModel({
      type: "rendoc",
      value,
    });
    setCurrMenu(null);
  };

  const downloadHandler = (doc) => {
    exportAsPdf(JSON.parse(doc.data), doc.id);
    setAlert({
      type: "success",
      message: `Document ${doc.id} has started downloading...`,
    });
  };

  const exportHandler = () => {
    exportDocument(data);
    setAlert({
      type: "success",
      message:
        "Document has been exported as JSON string on your clipboard. created a new file with '.json' extention and paste the string in it.",
    });
    setCurrMenu(null);
  };

  const showDetails = (v) => {
    const details = [
      ["id", v.id],
      ["created at", v.createdAt.toDate().toDateString()],
      ["modified at", v.modifiedAt.toDate().toDateString()],
    ];
    setModel({ type: "showDetails", details });
  };

  return (
    <div className="flex w-full h-full">
      <DocumentsSideBar />
      <div className="w-full p-2">
        <div className="flex items-center pr-1">
          <div className="grid w-full grid-cols-12 p-2 font-semibold">
            <div className="col-span-full sm:col-span-9 md:col-span-6">
              Documents
            </div>
            <div className="hidden col-span-3 sm:block">
              Modified At
            </div>
            <div className="hidden col-span-3 md:block">
              Created At
            </div>
          </div>
          <Button Icon={IcHelp} label={["document"]} />
        </div>
        {documents.map((value, docIndex) => (
          <div
            key={value.id}
            className={`menu-item group flex ${
              docIndex % 2 === 0 && "bg-dark/10"
            }`}
          >
            <Link
              to={`/editor/${value.id}`}
              className="grid w-full grid-cols-12"
            >
              <div className="flex col-span-full gap-x-1 items-center group-hover:underline sm:col-span-9 md:col-span-6">
                <IcDoc className="icon" />
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {value.id}
                </div>
              </div>
              <div className="hidden col-span-3 sm:block">
                {getRelativeDate(value.modifiedAt)}
              </div>
              <div className="hidden col-span-3 md:block">
                {getRelativeDate(value.createdAt)}
              </div>
            </Link>
            <MoreMenu
              menuId={`documents:${value.id}`}
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
              options={[
                ["rename", () => renameHandler(value.id), IcEdit],
                ["export", exportHandler, IcExport],
                ["download", () => downloadHandler(value), IcDownload],
                ["delete", () => deleteHandler(value.id), IcBin],
                ["details", () => showDetails(value), IcAbout],
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;

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
} from "../../helpers/icons";
import OptionBar from "./OptionBar";
import useDocument from "../../hooks/useDocument";
import { usePdf } from "../../hooks/usePdf";
import MoreMenu from "../../components/MoreMenu";
import { useAuth } from "../../Contexts/AuthContext";

const Documents = () => {
  const { setModel, data, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { exportDocument } = useEditor();
  const { getAllDocuments } = useDocument();
  const { exportAsPdf } = usePdf();

  const [documents, setDocuments] = React.useState([]);

  React.useEffect(() => {
    document.title = `SH-Maker - Documents`;
    getAllDocuments(currUser.uid, setDocuments);
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
    <div className="flex justify-center">
      <div className="mx-2 w-full max-w-[1400px] space-y-2">
        <OptionBar />
        <div className="border rounded-lg shadow-lg">
          {documents.map((value, docIndex) => (
            <div
              className={`menu-item group flex justify-between text-center ${
                docIndex % 2 === 0 && "bg-dark/5"
              }`}
            >
              <Link
                to={`/editor/${value.id}`}
                className="grid w-full grid-cols-12"
              >
                <div className="space-x-1 text-left col-span-full group-hover:underline sm:col-span-9 md:col-span-6">
                  <IcDoc className="inline-block icon" />
                  <span>
                    {value.id.length > 30
                      ? value.id.slice(0, 38) + "..."
                      : value.id}
                  </span>
                </div>
                <div className="hidden col-span-3 sm:block">
                  {value.createdAt.toDate().toDateString()}
                </div>
                <div className="hidden col-span-3 md:block">
                  {value.modifiedAt.toDate().toDateString()}
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
    </div>
  );
};

export default Documents;

import React from "react";
import useEditor from "../../hooks/useEditor";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import {
  IcAbout,
  IcBin,
  IcDownload,
  IcEdit,
  IcExport,
  IcStar,
  IcStarFilled,
} from "../../helpers/icons";
import DocumentsSideBar from "./DocumentsSideBar";
import useDocument from "../../hooks/useDocument";
import { usePdf } from "../../hooks/usePdf";
import MoreMenu from "../../components/MoreMenu";
import { useAuth } from "../../Contexts/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  usePageTitle("Documents");

  const menuRef = React.useRef(null);
  const [currMenu, setCurrMenu] = React.useState(null);

  const { setModel, data, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { exportDocument } = useEditor();
  const { getAllDocuments, setDocumentInfo } = useDocument();
  const { exportAsPdf } = usePdf();

  const [documents, setDocuments] = React.useState([]);
  const [favDocuments, setFavDocuments] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    getAllDocuments(currUser.username, setDocuments, setFavDocuments);
  }, []);

  const handleFavorite = (v) => {
    setDocumentInfo(currUser.username, v.id, "favorite", !v.favorite);
  };

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

  const WraperMoreMenu = (v, n = "") => (
    <MoreMenu
      menuId={`documents:${v.id}${n}`}
      menuRef={menuRef}
      currMenu={currMenu}
      setCurrMenu={setCurrMenu}
      options={[
        v?.favorite
          ? ["unfavorite", () => handleFavorite(v), IcStarFilled]
          : ["favorite", () => handleFavorite(v), IcStar],
        ["rename", () => renameHandler(v.id), IcEdit],
        ["export", exportHandler, IcExport],
        ["download", () => downloadHandler(v), IcDownload],
        ["delete", () => deleteHandler(v.id), IcBin],
        ["details", () => showDetails(v), IcAbout],
      ]}
    />
  );

  return (
    <div className="flex h-full w-full">
      <DocumentsSideBar
        {...{ search, setSearch, favDocuments, WraperMoreMenu }}
      />
      <Table
        {...{
          id: "documents",
          documents,
          search,
          goTo: (v) => navigate(`/editor/${v.id}`),
          moreMenu: (v) => WraperMoreMenu(v, "1"),
        }}
      />
    </div>
  );
};

export default Documents;

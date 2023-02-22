import React from "react";
// Types.
import { Document } from "../../helpers/types";
// Contexts.
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useAuth } from "../../Contexts/AuthContext";
// Hooks.
import useDocument from "../../hooks/useDocument";
import usePdf from "../../hooks/usePdf";
import useDataExchange from "../../hooks/useDataExchange";
import usePageTitle from "../../hooks/usePageTitle";

const useDocumentsPage = () => {
  usePageTitle("Documents");

  const menuRef = React.useRef(null);
  const [currMenu, setCurrMenu] = React.useState<string | null>(null);

  const { setModel, data, setAlert } = useGlobalContext();
  const { currUser } = useAuth();
  const { exportDocument } = useDataExchange();
  const { getAllDocuments, setDocumentInfo } = useDocument();
  const { exportAsPdf } = usePdf();

  const [documents, setDocuments] = React.useState([]);
  const [favDocuments, setFavDocuments] = React.useState([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    getAllDocuments(currUser.username, setDocuments, setFavDocuments);
  }, []);

  const handleFavorite = async (v: Document) => {
    await setDocumentInfo(currUser.username, v.id, "favorite", !v.favorite);
  };

  const handleNewDoc = () => {
    setModel({
      type: "newdoc",
    });
  };

  const handleDelete = (name: string) => {
    setModel({
      type: "deldoc",
      name,
    });
    setCurrMenu(null);
  };

  const handleRename = (value: string) => {
    setModel({
      type: "rendoc",
      value,
    });
    setCurrMenu(null);
  };

  const handleDownload = (doc: Document) => {
    // exportAsPdf(JSON.parse(doc.data), doc.id, doc.template);
    setAlert({
      type: "success",
      message: `Document ${doc.id} has started downloading...`,
    });
  };

  const handleExport = () => {
    // exportDocument(data);
    setAlert({
      type: "success",
      message:
        "Document has been exported as JSON string on your clipboard. created a new file with '.json' extention and paste the string in it.",
    });
    setCurrMenu(null);
  };

  const handleDetails = (v: Document) => {
    const details = [
      ["id", v.id],
      ["created at", v.createdAt.toDate().toDateString()],
      ["modified at", v.modifiedAt.toDate().toDateString()],
    ];
    setModel({ type: "showDetails", details });
  };

  return {
    search,
    setSearch,
    documents,
    favDocuments,
    menuRef,
    currMenu,
    setCurrMenu,
    handleNewDoc,
    handleFavorite,
    handleDelete,
    handleRename,
    handleDownload,
    handleExport,
    handleDetails,
  };
};

export default useDocumentsPage;

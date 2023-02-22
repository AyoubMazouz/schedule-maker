import React from "react";
import { useNavigate } from "react-router-dom";
// Types.
import { Document } from "../../helpers/types";
// Hooks.
import useDocumentsPage from "./useDocumentsPage";
// Components.
import DocumentsSideBar from "./DocumentsSideBar";
import Table from "../../components/Table";
import MoreMenu from "../../components/MoreMenu";
import {
  IcAbout,
  IcBin,
  IcDownload,
  IcEdit,
  IcExport,
  IcStar,
  IcStarFilled,
} from "../../helpers/icons";

const Documents = () => {
  const {
    search,
    currMenu,
    setCurrMenu,
    documents,
    menuRef,
    handleFavorite,
    handleDelete,
    handleRename,
    handleDownload,
    handleExport,
    handleDetails,
  } = useDocumentsPage();

  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full">
      <DocumentsSideBar />
      <Table
        {...{
          id: "documents",
          documents,
          search,
          goTo: (v: Document) => navigate(`/editor/${v.id}`),
          moreMenu: (v: Document) => (
            <MoreMenu
              menuId={`DOCUMENTS:${v.id}$`}
              menuRef={menuRef}
              currMenu={currMenu}
              setCurrMenu={setCurrMenu}
              options={[
                v.favorite
                  ? ["unfavorite", () => handleFavorite(v), IcStarFilled]
                  : ["favorite", () => handleFavorite(v), IcStar],
                ["rename", () => handleRename(v.id), IcEdit],
                ["export", handleExport, IcExport],
                ["download", () => handleDownload(v), IcDownload],
                ["delete", () => handleDelete(v.id), IcBin],
                ["details", () => handleDetails(v), IcAbout],
              ]}
            />
          ),
        }}
      />
    </div>
  );
};

export default Documents;

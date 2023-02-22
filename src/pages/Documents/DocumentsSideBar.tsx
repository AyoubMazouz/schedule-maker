import React from "react";
// Types.
import { Document } from "../../helpers/types";
// Hooks.
import useDocumentsPage from "./useDocumentsPage";
import useDataExchange from "../../hooks/useDataExchange";
// Components.
import { Input } from "../../components/Input";
import MoreMenu from "../../components/MoreMenu";
import {
  IcAbout,
  IcBin,
  IcDownload,
  IcEdit,
  IcExport,
  IcStar,
  IcNewDoc,
  IcImport,
  IcSearch,
  IcStarFilled,
} from "../../helpers/icons";

const DocumentsSideBar = () => {
  const {
    search,
    setSearch,
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
  } = useDocumentsPage();

  const { importDocument } = useDataExchange();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    importDocument(e.target.files[0], () => {
      //
    });
  };

  return (
    <div className="h-[calc(100vh-3rem)] min-w-[220px] max-w-[300px] border-r-[1px] border-dark/50">
      <div className="border-b-[1px] border-dark/50 p-2 shadow-sm">
        <Input
          type="text"
          Icon={IcSearch}
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          inputStyle="w-full"
        />
      </div>
      <div className="border-b-[1px] border-dark/50 shadow-sm">
        <button className="menu-item py-2" onClick={handleNewDoc}>
          <IcNewDoc className="icon" />
          New
        </button>
        <button className="menu-item py-2">
          <IcImport className="icon" />
          import
          <input
            type="file"
            accept=".json"
            className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer opacity-0"
            onChange={(e) => handleImport(e)}
          />
        </button>
      </div>
      <div>
        {favDocuments.map((v: Document) => (
          <div key={v.id} className="menu-item justify-between">
            <div className="flex items-center gap-x-1">
              <IcStarFilled className="icon" />
              {v.id}
            </div>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSideBar;

import React from "react";
import { Link } from "react-router-dom";
import { IcDoc, IcDown, IcHelp } from "../helpers/icons";
import { Document } from "../helpers/types";
import { getRelativeDate } from "../helpers/util";
import { Button } from "./Button";

const Table = ({ id, documents, search, moreMenu, goTo }: any) => {
  const [filtredDocuments, setFiltredDocuments] = React.useState<Document[]>(
    []
  );
  const [filter, setFilter] = React.useState({ by: "DOCUMENTS", acs: true });

  React.useEffect(() => {
    if (search.trim().length === 0) setFiltredDocuments(documents);
    else
      setFiltredDocuments(
        documents.filter((d: Document) =>
          d.id.toLowerCase().includes(search.trim().toLowerCase())
        )
      );
  }, [documents, search]);

  React.useEffect(() => {
    if (filter.acs) {
      if (filter.by === "DOCUMENTS")
        setFiltredDocuments(
          filtredDocuments.sort((a, b) => (a.id < b.id ? 1 : -1))
        );
      else if (filter.by === "MODIFIED_AT")
        setFiltredDocuments(
          filtredDocuments.sort((a, b) =>
            a.modifiedAt < b.modifiedAt ? 1 : -1
          )
        );
      else if (filter.by === "CREATED_AT")
        setFiltredDocuments(
          filtredDocuments.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        );
    } else {
      if (filter.by === "DOCUMENTS")
        setFiltredDocuments(
          filtredDocuments.sort((a, b) => (a.id > b.id ? 1 : -1))
        );
      else if (filter.by === "MODIFIED_AT")
        setFiltredDocuments(
          filtredDocuments.sort((a, b) =>
            a.modifiedAt > b.modifiedAt ? 1 : -1
          )
        );
      else if (filter.by === "CREATED_AT")
        setFiltredDocuments(
          filtredDocuments.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
        );
    }
  }, [filtredDocuments, filter]);

  const handleFilter = (by: string) => {
    setFilter((x) => ({ by, acs: by === x.by ? !x.acs : true }));
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center pr-1">
        <div className="grid w-full grid-cols-12 p-2 font-semibold">
          <button
            onClick={() => handleFilter("DOCUMENTS")}
            className="col-span-full flex cursor-pointer items-center gap-x-2 capitalize sm:col-span-9 md:col-span-6"
          >
            {id}
            {filter.by === "DOCUMENTS" && (
              <IcDown className={`${!filter.acs && "rotate-180"}`} />
            )}
          </button>
          <button
            onClick={() => handleFilter("MODIFIED_AT")}
            className="col-span-3 hidden cursor-pointer items-center gap-x-2 md:flex"
          >
            Modified At
            {filter.by === "MODIFIED_AT" && (
              <IcDown className={`${!filter.acs && "rotate-180"}`} />
            )}
          </button>
          <button
            onClick={() => handleFilter("CREATED_AT")}
            className="col-span-3 hidden cursor-pointer items-center gap-x-2 sm:flex"
          >
            Created At
            {filter.by === "CREATED_AT" && (
              <IcDown className={`${!filter.acs && "rotate-180"}`} />
            )}
          </button>
        </div>
        <Button Icon={IcHelp} label={["document"]} />
      </div>
      {filtredDocuments.map((value, docIndex) => (
        <div
          key={value.id}
          className={`menu-item group flex ${
            docIndex % 2 === 0 && "bg-dark/5"
          }`}
        >
          <button
            onClick={() => goTo(value)}
            className="grid w-full grid-cols-12 text-left"
          >
            <div className="col-span-full flex items-center gap-x-1 group-hover:underline sm:col-span-9 md:col-span-6">
              <IcDoc className="icon" />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {value.id}
              </div>
            </div>
            <div className="col-span-3 hidden md:block">
              {getRelativeDate(value.modifiedAt)}
            </div>
            <div className="col-span-3 hidden sm:block">
              {getRelativeDate(value.createdAt)}
            </div>
          </button>
          {moreMenu(value)}
        </div>
      ))}
    </div>
  );
};

export default Table;

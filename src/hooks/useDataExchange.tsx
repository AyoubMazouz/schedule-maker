import React from "react";
import { Schedule } from "../helpers/types";

const useDataExchange = () => {
  const exportDocument = (data: Schedule[], fileName: string) => {
    const jsonData = JSON.stringify(data);
    const link = document.createElement("a");
    link.href = "data:application/json," + jsonData;
    link.download = `${fileName}.schedule-maker.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importDocument = (file: any, callback: Function) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = async (readerEvent: any) => {
      const json = readerEvent.target.result;
      const document = JSON.parse(json);
      callback(document);
    };
  };
  const importDocumentAsFile = async (userId: string, file: any) => {
    // importDocument(file, (doc) => addNewDocument(userId, file.name, doc));
  };
  return { importDocument, exportDocument };
};

export default useDataExchange;

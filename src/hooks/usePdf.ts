import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  DAYS_TEXT,
  DOMAIN_NAME,
  EVENT_COL,
  LIGHT_COL,
  PRIMARY_COL,
  SECONDARY_COL,
  SESSIONS_TEXT,
} from "../helpers/constants";
import { Schedual } from "../helpers/types";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Bold.ttf",
    italics: "Roboto-Italic.ttf",
  },
};

export const usePdf = () => {
  const getSessionObj = (text: string) => {
    return {
      text: "\n" + text,
      fontSize: 26,
      lineHeight: 0.4,
      color: "white",
    };
  };
  const getLabel = (session: string[], i: number) => {
    if (i === 1)
      return {
        text: session[3] ? `${session[1]} ${session[3]}` : session[1],
        fontSize: 14,
      };
    else if (i === 2)
      return {
        text: session[i],
        fontSize: 24,
        alignment: "right",
      };
    return {
      text: session[i],
      fontSize: 20,
    };
  };
  const tableData = (data: string[][][]) => {
    const copiedData = JSON.parse(JSON.stringify(data));
    return copiedData.map((day: any, index: number) => {
      day.unshift([
        {
          text: "\n" + DAYS_TEXT[index],
          style: "tableBody",
          fontSize: 26,
          lineHeight: 0.4,
          color: LIGHT_COL,
        },
      ]);
      return day.map((session: string[]) => {
        return [
          getLabel(session, 0),
          getLabel(session, 1),
          getLabel(session, 2),
        ];
      });
    });
  };

  const getFillColor = (
    data: Schedual[],
    schedualIndex: number,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (rowIndex === 0 && columnIndex === 0) return null;
    if (rowIndex === 0 || columnIndex === 0) return PRIMARY_COL;
    if (data[schedualIndex].schedual[rowIndex - 1][columnIndex - 1][3])
      return EVENT_COL;
    else
      return data[schedualIndex].schedual[rowIndex - 1][columnIndex - 1][0]
        ? SECONDARY_COL
        : null;
  };
  const exportAsPdf = (data: Schedual[], docName: string) => {
    const content: any = [];

    data.forEach((schedual, index) => {
      content.push({
        text: `${schedual.group} ${new Array(55 - schedual.group.length)
          .fill(" . ")
          .join("")} ${index + 1}`,
        linkToPage: `${index + 2}`,
        fontSize: 18,
      });
      if (index === data.length - 1)
        content.push({
          text: `Made with: ${DOMAIN_NAME}`,
          link: DOMAIN_NAME,
          fontSize: 18,
          pageBreak: "after",
        });
    });

    data.forEach((schedual: Schedual, schedualIndex) => {
      content.push({
        style: "tableExample",
        table: {
          headerRows: 0,
          widths: ["*", "*", "*", "*", "*"],
          heights: 65,
          body: [
            [
              {},
              getSessionObj(SESSIONS_TEXT[0]),
              getSessionObj(SESSIONS_TEXT[1]),
              getSessionObj(SESSIONS_TEXT[2]),
              getSessionObj(SESSIONS_TEXT[3]),
            ],
            ...tableData(schedual.schedual),
          ],
        },
        layout: {
          fillColor: function (
            rowIndex: number,
            node: any,
            columnIndex: number
          ) {
            return getFillColor(data, schedualIndex, rowIndex, columnIndex);
          },
        },
      });

      content.push({
        text: `Group: ${schedual.group}`,
        fontSize: 18,
      });
      content.push({
        text: `TotalHours: ${schedual.totalHours}`,
        fontSize: 18,
      });
      content.push({
        text: `${schedualIndex + 1}`,
        fontSize: 22,
        pageBreak: "after",
        alignment: "right",
      });
    });

    const doc: any = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [10, 10],
      defaultStyle: {
        font: "Roboto",
      },
      content,
    };
    pdfMake.createPdf(doc, undefined, pdfMake.fonts).download(docName + ".pdf");
  };

  return { exportAsPdf };
};

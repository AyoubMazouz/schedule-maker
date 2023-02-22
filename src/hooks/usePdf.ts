import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  EVENT_COL,
  LIGHT_COL,
  PRIMARY_COL,
  SECONDARY_COL,
} from "../helpers/constants";
import { TEMPLATES } from "../helpers/templates";
import { Schedule } from "../helpers/types";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Bold.ttf",
    italics: "Roboto-Italic.ttf",
  },
};

const DOMAIN_NAME = window.location.href;

const usePdf = () => {
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
  const tableData = (data: string[][][], DAYS: string[]) => {
    const copiedData = JSON.parse(JSON.stringify(data));
    return copiedData.map((day: any, index: number) => {
      day.unshift([
        {
          text: "\n" + DAYS[index],
          style: "tableBody",
          fontSize: 14,
          lineHeight: 1.4,
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
    data: Schedule[],
    scheduleIndex: number,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (rowIndex === 0 && columnIndex === 0) return null;
    if (rowIndex === 0 || columnIndex === 0) return PRIMARY_COL;
    if (data[scheduleIndex].schedule[rowIndex - 1][columnIndex - 1][3])
      return EVENT_COL;
    else
      return data[scheduleIndex].schedule[rowIndex - 1][columnIndex - 1][0]
        ? SECONDARY_COL
        : null;
  };

  const getFirstRow = (SESSIONS: string[]) => {
    const res: any[] = SESSIONS.map((text) => ({
      text: "\n" + text,
      fontSize: 14,
      lineHeight: 1.4,
      color: "white",
      alignment: "center",
    }));
    res.unshift({});
    return res;
  };
  const exportAsPdf = (data: Schedule[], docName: string, template: string) => {
    const content: any = [],
      SESSIONS = TEMPLATES[template].labels.sessions,
      DAYS = TEMPLATES[template].labels.days,
      CELL_HEIGHT = Math.floor(455 / (DAYS.length + 1)),
      CELL_WIDTH = new Array(SESSIONS.length + 1).fill("*");

    console.log(CELL_HEIGHT);

    data.forEach((schedule, index) => {
      content.push({
        text: `${schedule.group} ${new Array(55 - schedule.group.length)
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

    data.forEach((schedule: Schedule, scheduleIndex) => {
      content.push({
        style: "tableExample",
        table: {
          headerRows: 0,
          widths: CELL_WIDTH,
          heights: CELL_HEIGHT,
          body: [getFirstRow(SESSIONS), ...tableData(schedule.schedule, DAYS)],
        },
        layout: {
          fillColor: function (
            rowIndex: number,
            node: any,
            columnIndex: number
          ) {
            return getFillColor(data, scheduleIndex, rowIndex, columnIndex);
          },
        },
      });

      content.push({
        text: `Group: ${schedule.group}`,
        fontSize: 12,
      });
      content.push({
        text: `TotalHours: ${schedule.totalHours}`,
        fontSize: 12,
      });
      content.push({
        text: `${scheduleIndex + 1}`,
        fontSize: 16,
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

export default usePdf;

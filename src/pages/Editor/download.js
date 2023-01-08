import { DAYS_TEXT, SESSIONS_TEXT } from "../../constants";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
    Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-Italic.ttf",
    },
};

const copyData = (data) => JSON.parse(JSON.stringify(data));

const getSessionObj = (text) => {
    return {
        text: "\n" + text,
        style: "tableBody",
        fontSize: 28,
        lineHeight: 0.4,
        alignment: "center",
        color: "white",
    };
};

const getLabel = (text) => {
    let color = "#3333";

    // console.log(text);

    if (typeof text === "string" && text.split(" ").includes("EFM"))
        color = "red";

    return {
        text,
        color,
        style: "tableBody",
        fontSize: 18,
    };
};
const getRoomLabel = (text) => {
    if (!text) return;

    return {
        text: text.toLowerCase() !== "teams" ? "Room " + text : text,
        color: "#3333",
        style: "tableBody",
        fontSize: 18,
    };
};

const tableData = (data) => {
    const copiedData = JSON.parse(JSON.stringify(data));
    return copiedData.map((day, index) => {
        day.unshift([
            {
                text: "\n" + DAYS_TEXT[index],
                style: "tableBody",
                fontSize: 28,
                lineHeight: 0.4,
                color: "white",
            },
        ]);
        return day.map((session) => {
            return [
                getLabel(session[0]),
                getLabel(session[1]),
                getRoomLabel(session[2]),
            ];
        });
    });
};

const getFillColor = (data, schedualIndex, rowIndex, node, columnIndex) => {
    if (rowIndex === 0 && columnIndex === 0) return null;

    if (rowIndex === 0 || columnIndex === 0) return "#C060A1";
    else
        return data[schedualIndex].schedual[rowIndex - 1][columnIndex - 1][0]
            ? "#eef"
            : null;
};

export const downloadShedual = (data) => {
    const content = [];

    data.forEach((schedual, schedualIndex) => {
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
                fillColor: function (rowIndex, node, columnIndex) {
                    return getFillColor(
                        data,
                        schedualIndex,
                        rowIndex,
                        node,
                        columnIndex
                    );
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
            pageBreak: "after",
        });
    });

    const doc = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: 10,
        content,
    };
    pdfMake.createPdf(doc).download();
};

import React from "react";
import {
    setDoc,
    Timestamp,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    collection,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DAYS_TEXT, EMPTY_SCHEDUAL, SESSIONS_TEXT } from "../../constants";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
    Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-Italic.ttf",
    },
};

const useEditor = () => {
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
            return data[schedualIndex].schedual[rowIndex - 1][
                columnIndex - 1
            ][0]
                ? "#eef"
                : null;
    };

    const downloadAsPdf = (data) => {
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

    const [loading, setLoading] = React.useState(false);

    const copyData = (data) => JSON.parse(JSON.stringify(data));

    // Document.
    const documentExists = (name) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", name));
            if (snapshot.exists()) resolve(true);
            resolve(false);
        });
    };

    const addNewDocument = (data, name) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            const document = {
                name,
                createdAt: Timestamp.now(),
                modifiedAt: Timestamp.now(),
                data: JSON.stringify(data),
            };

            await setDoc(doc(db, "documents", name), document);
            setLoading(false);
            resolve(true);
        });
    };

    const getDocument = (name) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "documents", name));
            if (snapshot.exists()) resolve(snapshot.data());
        });
    };

    const getAllDocuments = (setDocs) => {
        onSnapshot(
            query(collection(db, "documents"), orderBy("createdAt")),
            (snap) => {
                const docs = [];
                snap.forEach((doc) => {
                    const data = doc.data();
                    docs.push(data);
                });
                setDocs(docs);
            }
        );
    };

    const deleteDocument = (name) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            const snapshot = await deleteDoc(doc(db, "documents", name));
            setLoading(false);
            resolve(snapshot);
        });
    };

    const renameDocument = (name, newName) => {
        return new Promise(async (reject, resolve) => {
            setLoading(true);

            const document = await getDocument(name);

            if (doc) {
                document.modifiedAt = Timestamp.now();
                document.name = newName;
                await deleteDocument(name);
                await setDoc(doc(db, "documents", newName), document);

                setLoading(false);
                resolve(true);
            }

            setLoading(false);
            reject(false);
        });
    };

    const exportDocument = (data, docName) => {
        const jsonData = JSON.stringify(data);
        const link = document.createElement("a");
        link.href = "data:application/json," + jsonData;
        link.download = `${docName}.schedual-maker.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const importFromXl = (file, callback) => {
        // Support for xls, xlsm
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data);

            const document = [];
            const columns = "CDEFGHIJKLMNOPQRSTUVWXYZ".split("");

            let i = 7;
            let id = 0;

            while (i < 82) {
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                if (worksheet[`A${i}`] && worksheet[`A${i}`]?.v) {
                    if (worksheet[`A${i}`].v.slice(0, 5) !== "NTIC1") {
                        i += 3;
                        continue;
                    }
                }

                let day = [];
                let schedual = {
                    id,
                    group: worksheet[`A${i}`].v.slice(6),
                    date: "",
                    totalHours: worksheet[`AB${i}`].v,
                    schedual: [],
                };

                columns.forEach((col, index) => {
                    if (worksheet[`${col}${i}`] && worksheet[`${col}${i}`]?.v)
                        day.push([
                            worksheet[`${col}${i}`].v,
                            worksheet[`${col}${i + 1}`].v,
                            worksheet[`${col}${i + 2}`].v,
                        ]);
                    else day.push(["", "", ""]);

                    if ((index + 1) % 4 === 0) {
                        schedual.schedual.push(day);
                        day = [];
                    }
                });

                i += 3;
                id++;
                document.push(schedual);
            }
            callback(document);
        };
        reader.readAsArrayBuffer(file);
    };
    const importFromJson = (file, callback) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async (readerEvent) => {
            const json = readerEvent.target.result;
            const document = JSON.parse(json);
            callback(document);
        };
    };
    const importDocumentAsFile = async (e) => {
        const file = e.target.files[0];
        if (file.name.includes(".xls") || file.name.includes(".xlsm")) {
            const name = file.name.includes(".xls")
                ? file.name.replace(".xls", "")
                : file.name.replace(".xlsm", "");

            importFromXl(file, (doc) => addNewDocument(doc, name));
        } else if (file.name.includes(".json")) {
            importFromJson(file, (doc) =>
                addNewDocument(doc, file.name.replace(".json", ""))
            );
        }
    };
    const importDocument = (setData, file) => {
        if (file.name.includes(".xls") || file.name.includes(".xlsm")) {
            importFromXl(file, (doc) => setData(doc));
        } else if (file.name.includes(".json")) {
            importFromJson(file, (doc) => setData(doc));
        }
    };

    // Schedual.

    const editField = (
        data,
        setData,
        setAlert,
        schedual,
        day,
        session,
        row,
        value
    ) => {
        const copiedData = copyData(data);
        let hoursCount = 0;

        copiedData[schedual].schedual[day][session][row] = value;

        copiedData.forEach((sch, schIndex) => {
            sch.schedual.forEach((d, dIndex) => {
                d.forEach((sess, sessIndex) => {
                    // Session String.
                    const sessionTextSplited =
                        SESSIONS_TEXT[sessIndex].split("-");

                    // Check if Room or Prof available.
                    // Prof
                    if (
                        sess[0] === value &&
                        schIndex !== schedual &&
                        dIndex === day &&
                        sessIndex === session &&
                        sess[2].toLowerCase() !== "teams"
                    ) {
                        const message = `The professor "${value}" is not available on "${DAYS_TEXT[dIndex]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" working with the group "${sch.group}" in classRoom number "${sess[2]}".`;

                        setAlert({
                            type: "warn",
                            message,
                        });

                        copiedData[schedual].schedual[day][session][row] = "";
                    }
                    // Room.
                    else if (
                        sess[2] === value &&
                        schIndex !== schedual &&
                        dIndex === day &&
                        sessIndex === session &&
                        sess[2].toLowerCase() !== "teams"
                    ) {
                        const message = `The Room number "${value}" is not available on "${DAYS_TEXT[dIndex]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" it is ocupied by the group "${sch.group}".`;

                        setAlert({
                            type: "warn",
                            message,
                        });

                        copiedData[schedual].schedual[day][session][row] = "";
                    }

                    // Count Total Hours.
                    if (schIndex === schedual)
                        if (
                            copiedData[schedual].schedual[dIndex][
                                sessIndex
                            ][0].trim() &&
                            copiedData[schedual].schedual[dIndex][
                                sessIndex
                            ][1].trim() &&
                            copiedData[schedual].schedual[dIndex][
                                sessIndex
                            ][2].trim()
                        )
                            hoursCount += 2.5;
                });
            });
        });

        copiedData[schedual].totalHours = hoursCount;
        setData(copiedData);
    };

    const editSchedualInfo = (
        data,
        setData,
        setAlert,
        schedual,
        label,
        value
    ) => {
        // Check if Group alreadty have a Schedual.
        if (label === "group") {
            for (let i = 0; i < data.length; i++) {
                if (data[i].group === value)
                    return setAlert({
                        type: "warn",
                        message:
                            "You have already created a Schedual for this group",
                    });
            }
        }

        const copiedData = copyData(data);
        copiedData[schedual][label] = value;
        setData(copiedData);
    };

    const addNewSchedual = (data, setData, setAlert) => {
        setLoading(true);

        if (data.length === 0) {
            const newData = [copyData(EMPTY_SCHEDUAL)];
            setData(newData);
            setLoading(false);
            return true;
        }

        if (!data[data.length - 1].group) {
            setLoading(false);
            setAlert({
                type: "warn",
                message:
                    "You should finish the previous table or at least fill the 'group' field.",
            });
            return false;
        }

        const copiedData = copyData(data);
        const newSchedual = copyData(EMPTY_SCHEDUAL);
        newSchedual.id = copiedData.length;
        copiedData.push(newSchedual);
        setData(copiedData);

        setLoading(false);
        return true;
    };

    const deleteSchedual = (data, setData, setAlert, id) => {
        setLoading(true);

        const newData = data.filter((schedual) => schedual.id !== id);
        setData(newData);
        setAlert({
            type: "success",
            message: `Schedual Number ${id + 1} has been deleted`,
        });

        setLoading(false);
    };

    return {
        loading,
        addNewDocument,
        documentExists,
        getAllDocuments,
        getDocument,
        deleteDocument,
        renameDocument,
        exportDocument,
        importDocument,
        importDocumentAsFile,
        editField,
        editSchedualInfo,
        deleteSchedual,
        addNewSchedual,
        downloadAsPdf,
    };
};

export default useEditor;
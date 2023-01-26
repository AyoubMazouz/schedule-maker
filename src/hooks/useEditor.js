import XLSX from "xlsx";
import { DAYS_TEXT, EMPTY_SCHEDUAL, SESSIONS_TEXT } from "../constants";
import useDocument from "./useDocument";

const useEditor = () => {
    const { addNewDocument, loading } = useDocument();

    const exportDocument = (data, fileName) => {
        const jsonData = JSON.stringify(data);
        const link = document.createElement("a");
        link.href = "data:application/json," + jsonData;
        link.download = `${fileName}.schedual-maker.json`;
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
                            worksheet[`${col}${i}`].v.charAt(0).toUpperCase() +
                                worksheet[`${col}${i}`].v
                                    .slice(1)
                                    .toLowerCase(),
                            worksheet[`${col}${i + 1}`].v,
                            worksheet[`${col}${i + 2}`].v.replace("SALLE ", ""),
                            null,
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
    const importDocument = (file, setData) => {
        if (file.name.includes(".xls") || file.name.includes(".xlsm")) {
            importFromXl(file, (doc) => setData(doc));
        } else if (file.name.includes(".json")) {
            importFromJson(file, (doc) => setData(doc));
        }
    };

    const clearCell = (
        data,
        setData,
        fusionMode,
        schedualIndex,
        dayIndex,
        sessionIndex
    ) => {
        const copiedData = data.map((sch) => sch);
        copiedData[schedualIndex].schedual[dayIndex][sessionIndex] = [
            "",
            "",
            "",
            "",
        ];

        if (fusionMode) {
            const offset = sessionIndex % 2 === 0 ? 1 : -1;
            copiedData[schedualIndex].schedual[dayIndex][
                sessionIndex + offset
            ] = ["", "", "", ""];
        }

        setData(copiedData);
        return true;
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
        value,
        fusionMode
    ) => {
        let [hoursCount, message] = [0, ""];

        const copiedData = data.map((sch, schIndex) => {
            if (row === 1) return sch;
            return {
                ...sch,
                schedual: sch.schedual.map((d, dIndex) => {
                    return d.map((ses, sesIndex) => {
                        const sessionTextSplited =
                            SESSIONS_TEXT[sesIndex].split("-");

                        // Check if Prof available.
                        if (
                            ses[0] === value &&
                            schIndex !== schedual &&
                            dIndex === day &&
                            sesIndex === session &&
                            ses[2].toLowerCase() !== "teams"
                        ) {
                            message = `The professor "${value}" is not available on "${DAYS_TEXT[dIndex]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" working with the group "${data[schIndex].group}" in classRoom number "${ses[2]}".`;
                            return ses;
                        }
                        // Check if Room available.
                        else if (
                            ses[2] === value &&
                            schIndex !== schedual &&
                            dIndex === day &&
                            sesIndex === session &&
                            ses[2].toLowerCase() !== "teams"
                        ) {
                            message = `The Room number "${value}" is not available on "${DAYS_TEXT[dIndex]}", from "${sessionTextSplited[0]}" to "${sessionTextSplited[1]}" it is ocupied by the group "${sch.group}".`;
                            return ses;
                        }

                        // Count Total Hours.
                        if (schIndex === schedual)
                            if (ses[0] && ses[1] && ses[2]) hoursCount += 2.5;
                        return ses;
                    });
                }),
            };
        });

        if (message) {
            setAlert({
                type: "warn",
                message,
            });
            return false;
        }
        if (fusionMode) {
            const offset = session % 2 === 0 ? 1 : -1;
            copiedData[schedual].schedual[day][session + offset][row] = value;
        }

        copiedData[schedual].totalHours = hoursCount;
        copiedData[schedual].schedual[day][session][row] = value;
        setData(copiedData);
        return true;
    };

    const editSchedualInfo = (
        data,
        setData,
        setAlert,
        schedual,
        label,
        value
    ) => {
        let message = "";
        const copiedData = data.map((sch) => {
            if (sch.group === value) {
                message = "You have already created a Schedual for this group";
                return sch;
            }
            return sch;
        });
        if (message) {
            setAlert({
                type: "warn",
                message,
            });
            return false;
        }
        copiedData[schedual][label] = value;
        setData(copiedData);
        return true;
    };

    const addNewSchedual = (data, setData, setAlert) => {
        if (data.length === 0) {
            const newData = [EMPTY_SCHEDUAL];
            setData(newData);
            return true;
        }

        if (!data[data.length - 1].group) {
            setAlert({
                type: "warn",
                message:
                    "You should finish the previous table or at least fill the 'group' field.",
            });
            return false;
        }

        const newSchedual = { ...EMPTY_SCHEDUAL, id: data.length };
        setData([...data, newSchedual]);
        return true;
    };

    const deleteSchedual = (data, setData, id) =>
        setData(data.filter((sch) => sch.id !== id));

    return {
        loading,
        exportDocument,
        importDocument,
        importDocumentAsFile,
        editField,
        clearCell,
        editSchedualInfo,
        deleteSchedual,
        addNewSchedual,
    };
};

export default useEditor;

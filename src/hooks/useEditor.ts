import XLSX from "xlsx";
import { EMPTY_SCHEDUAL } from "../constants";
import { Schedual } from "../types";
import useDocument from "./useDocument";

interface ImportDoc {
    (file: any, callback: (a: Schedual[]) => void): void;
}
interface ClearCell {
    (
        data: Schedual[],
        setData: (a: Schedual[]) => void,
        fusionMode: boolean,
        schedualIndex: number,
        dayIndex: number,
        sessionIndex: number
    ): boolean;
}
interface EditField {
    (
        data: Schedual[],
        setData: (a: Schedual[]) => void,
        fusionMode: boolean,
        schedualIndex: number,
        dayIndex: number,
        sessionIndex: number,
        row: number,
        value: string
    ): boolean;
}
interface EditSchedualGrp {
    (
        data: Schedual[],
        setData: (a: Schedual[]) => void,
        schedualIndex: number,
        value: string
    ): boolean;
}
interface AddNewSchedual {
    (data: Schedual[], setData: (a: Schedual[]) => void): boolean;
}
interface DeleteSchedual {
    (data: Schedual[], setData: (a: Schedual[]) => void, id: number): void;
}

const useEditor = () => {
    const { addNewDocument, loading } = useDocument();

    const exportDocument = (data: Schedual[], fileName: string) => {
        const jsonData = JSON.stringify(data);
        const link = document.createElement("a");
        link.href = "data:application/json," + jsonData;
        link.download = `${fileName}.schedual-maker.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const importDocument: ImportDoc = (file, callback) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async (readerEvent: any) => {
            const json = readerEvent.target.result;
            const document = JSON.parse(json);
            callback(document);
        };
    };
    const importDocumentAsFile = async (userId: string, file: any) => {
        importDocument(file, (doc) => addNewDocument(userId, file.name, doc));
    };

    const clearCell: ClearCell = (
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
    const editField: EditField = (
        data,
        setData,
        fusionMode,
        schedualIndex,
        dayIndex,
        sessionIndex,
        row,
        value
    ) => {
        let [hoursCount, error] = [0, false];

        const copiedData = data.map((sch, schIndex) => {
            if (row === 1) return sch;
            return {
                ...sch,
                schedual: sch.schedual.map((d, dIndex) => {
                    return d.map((ses, sesIndex) => {
                        // Check if Prof available.
                        if (
                            ses[0] === value &&
                            schIndex !== schedualIndex &&
                            dIndex === dayIndex &&
                            sesIndex === sessionIndex &&
                            ses[2].toLowerCase() !== "teams"
                        ) {
                            error = true;
                            return ses;
                        }
                        // Check if Room available.
                        else if (
                            ses[2] === value &&
                            schIndex !== schedualIndex &&
                            dIndex === dayIndex &&
                            sesIndex === sessionIndex &&
                            ses[2].toLowerCase() !== "teams"
                        ) {
                            error = true;
                            return ses;
                        }

                        // Count Total Hours.
                        if (schIndex === schedualIndex)
                            if (ses[0] && ses[1] && ses[2]) hoursCount += 2.5;
                        return ses;
                    });
                }),
            };
        });

        if (error) return false;

        if (fusionMode) {
            const offset = sessionIndex % 2 === 0 ? 1 : -1;
            copiedData[schedualIndex].schedual[dayIndex][sessionIndex + offset][
                row
            ] = value;
        }

        copiedData[schedualIndex].totalHours = hoursCount;
        copiedData[schedualIndex].schedual[dayIndex][sessionIndex][row] = value;
        setData(copiedData);
        return true;
    };

    const editSchedualGrp: EditSchedualGrp = (
        data,
        setData,
        schedualIndex,
        value
    ) => {
        let error = false;
        const copiedData = data.map((sch) => {
            if (sch.group === value) {
                error = true;
                return sch;
            }
            return sch;
        });
        if (error) return false;

        copiedData[schedualIndex].group = value;
        setData(copiedData);
        return true;
    };

    const addNewSchedual: AddNewSchedual = (data, setData) => {
        if (data.length === 0) {
            const newData = [EMPTY_SCHEDUAL];
            setData(newData);
            return true;
        }

        if (!data[data.length - 1].group) {
            return false;
        }

        const newSchedual = { ...EMPTY_SCHEDUAL, id: data.length };
        setData([...data, newSchedual]);
        return true;
    };

    const deleteSchedual: DeleteSchedual = (data, setData, id) => {
        setData(data.filter((sch) => sch.id !== id));
    };

    return {
        loading,
        exportDocument,
        importDocument,
        importDocumentAsFile,
        editField,
        clearCell,
        editSchedualGrp,
        deleteSchedual,
        addNewSchedual,
    };
};

export default useEditor;

import React from "react";
import {
    setDoc,
    Timestamp,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
    collection,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { DAYS_TEXT, EMPTY_SCHEDUAL, SESSIONS_TEXT } from "../../constants";

const useEditor = () => {
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

    const addNewDocument = async (data, name) => {
        setLoading(true);
        const document = {
            name,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
            data: JSON.stringify(data),
        };

        await setDoc(doc(db, "documents", name), document);
        setLoading(false);
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

    const importDocument = (setData, file) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
            const json = readerEvent.target.result;
            const content = JSON.parse(json);
            setData(content);
        };
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
        editField,
        editSchedualInfo,
        deleteSchedual,
        addNewSchedual,
    };
};

export default useEditor;

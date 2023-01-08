import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const useSettings = () => {
    const copyData = (data) => JSON.parse(JSON.stringify(data));

    const addNewLabel = (labelType, label) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "settings", "labels"));

            if (snapshot.exists()) {
                const data = snapshot.data();

                if (data[labelType]) {
                    data[labelType].push(label);
                } else {
                    data[labelType] = [label];
                }
                data[labelType] = data[labelType].sort((a, b) =>
                    a.localeCompare(b)
                );
                console.log(data[labelType]);
                await setDoc(doc(db, "settings", "labels"), data);
                resolve(true);
            } else {
                const data = {
                    groups: [],
                    profNames: [],
                    rooms: [],
                };
                data[labelType].push(label);
                data[labelType] = data[labelType].sort((a, b) =>
                    a.localeCompare(b)
                );
                await setDoc(doc(db, "settings", "labels"), data);
                resolve(true);
            }
        });
    };

    const addNewProf = (profName) => {
        return addNewLabel("profNames", profName);
    };
    const addNewRoom = (RoomNum) => {
        return addNewLabel("rooms", RoomNum);
    };
    const addNewGroup = (group) => {
        return addNewLabel("groups", group);
    };

    const deleteLabel = (labelType, label) => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "settings", "labels"));

            if (snapshot.exists()) {
                const data = snapshot.data();

                const newData = data[labelType].filter((item) => {
                    return item !== label;
                });

                data[labelType] = newData;

                await setDoc(doc(db, "settings", "labels"), data);
                resolve(true);
            }
        });
    };

    const deleteProf = (profName) => {
        return deleteLabel("profNames", profName);
    };
    const deleteRoom = (room) => {
        return deleteLabel("rooms", room);
    };
    const deleteGroup = (group) => {
        return deleteLabel("groups", group);
    };

    const deleteAllLabels = () => {
        return new Promise(async (resolve, reject) => {
            await deleteDoc(doc(db, "settings", "labels"));
            resolve(true);
        });
    };

    const getAllLabels = () => {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getDoc(doc(db, "settings", "labels"));

            if (snapshot.exists()) {
                const data = snapshot.data();

                if (data.hasOwnProperty("groups")) {
                    resolve(data);
                } else {
                    resolve({ groups: [], profNames: [], rooms: [] });
                }
            }
            resolve({ groups: [], profNames: [], rooms: [] });
        });
    };
    return {
        addNewProf,
        addNewRoom,
        addNewGroup,
        deleteProf,
        deleteRoom,
        deleteGroup,
        deleteAllLabels,
        getAllLabels,
    };
};

export default useSettings;

import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/usePublish";
import { IcCancel, IcEx, IcLogin } from "../icons";

const AddFaculty = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { addFaculty, updateFaculty } = useSettings();

    const [faculty, setFaculty] = React.useState("");
    const [firstYear, setFirstYear] = React.useState(0);
    const [secondYear, setSecondYear] = React.useState(0);
    const [firstYearModules, setFirstYearModules] = React.useState([]);
    const [secondYearModules, setSecondYearModules] = React.useState([]);
    const [moduleInput1, setModuleInput1] = React.useState("");
    const [moduleInput2, setModuleInput2] = React.useState("");

    React.useEffect(() => {
        if (model.update) {
            setFaculty(model.value.name);
            setFirstYear(model.value.firstYear);
            setSecondYear(model.value.secondYear);
            setFirstYearModules(model.value.firstYearModules);
            setSecondYearModules(model.value.secondYearModules);
        }
    }, []);

    const enterKeyPressHandler1 = (e) => {
        if (e.key !== "Enter" || !moduleInput1) return;
        const value = moduleInput1.trim(" ");
        const newModules = firstYearModules.filter((mod) => mod !== value);
        if (newModules.length !== firstYearModules.length) {
            return setAlert({
                type: "warn",
                message: `Module "${value} is already in the list"`,
            });
        }
        setFirstYearModules((modules) => [...modules, value]);
        setModuleInput1("");
    };
    const enterKeyPressHandler2 = (e) => {
        if (e.key !== "Enter" || !moduleInput2) return;
        const value = moduleInput2.trim(" ");
        const newModules = secondYearModules.filter((mod) => mod !== value);
        if (newModules.length !== secondYearModules.length) {
            return setAlert({
                type: "warn",
                message: `Module "${value} is already in the list"`,
            });
        }
        setSecondYearModules((modules) => [...modules, value]);
        setModuleInput2("");
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const newFaculty = {
            id: model.labelsData.faculties.length,
            name: faculty,
            firstYear,
            secondYear,
            firstYearModules,
            secondYearModules,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };

        if (model.update) {
            newFaculty.id = model.value.id;
            updateFaculty(
                model.labelsData,
                model.setLabelsData,
                model.value.id,
                newFaculty
            );
        } else {
            const alreadyExist = model.labelsData.faculties.filter(
                (f) => f.name === faculty
            ).length;
            if (alreadyExist)
                return setAlert({
                    type: "warn",
                    message: `faculty "${faculty}" already exists!`,
                });
            addFaculty(model.labelsData, model.setLabelsData, newFaculty);
        }
        model.setSaved(false);
        setModel(null);
    };

    const removeModuleHandler = (e, value) => {
        if (e.target.id === "modules1") {
            const newModules = firstYearModules.filter((mod) => mod !== value);
            setFirstYearModules(newModules);
        } else {
            const newModules = secondYearModules.filter((mod) => mod !== value);
            setSecondYearModules(newModules);
        }
    };

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`w-full space-y-4 rounded-lg border-2 border-dark/25 bg-light p-4 shadow-lg`}
            >
                <div className="text-center text-xl text-primary">
                    Add New Faculty
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="input-label" htmlFor="faculty">
                        Faculty:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="text"
                        name="faculty"
                        value={faculty}
                        onChange={(e) =>
                            setFaculty(e.target.value.toUpperCase())
                        }
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="input-label" htmlFor="firstYear">
                        Number Of First Year Groups:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="number"
                        name="firstYear"
                        value={firstYear}
                        onChange={(e) => setFirstYear(e.target.value)}
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="input-label" htmlFor="secondYear">
                        Number Of Second Year Groups:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="number"
                        name="secondYear"
                        value={secondYear}
                        onChange={(e) => setSecondYear(e.target.value)}
                    />
                </div>
                <div className="textbox">
                    <span>First year modules: </span>
                    {firstYearModules.map((mod) => (
                        <div key={mod}>
                            {mod}
                            <IcEx
                                id="modules1"
                                onClick={(e) => removeModuleHandler(e, mod)}
                                className="textbox-icon"
                            />
                        </div>
                    ))}
                    <input
                        type="text"
                        id="modules1"
                        placeholder="type here..."
                        value={moduleInput1}
                        onChange={(e) =>
                            setModuleInput1(e.target.value.toUpperCase())
                        }
                        onKeyPress={enterKeyPressHandler1}
                    />
                </div>
                <div className="textbox">
                    <span>Second year modules</span>
                    {secondYearModules.map((mod) => (
                        <div key={mod}>
                            {mod}
                            <IcEx
                                id="modules2"
                                onClick={(e) => removeModuleHandler(e, mod)}
                                className="textbox-icon"
                            />
                        </div>
                    ))}
                    <input
                        type="text"
                        id="modules2"
                        placeholder="type here..."
                        value={moduleInput2}
                        onChange={(e) =>
                            setModuleInput2(e.target.value.toUpperCase())
                        }
                        onKeyPress={enterKeyPressHandler2}
                    />
                </div>
                <div className="flex gap-x-6">
                    <button
                        onClick={submitHandler}
                        className="btn-success"
                        type="submit"
                    >
                        <IcLogin className="icon" />
                        <span>Add</span>
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={(e) => setModel(null)}
                    >
                        <IcCancel className="icon" />
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFaculty;

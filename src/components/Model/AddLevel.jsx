import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { Button } from "../Button";
import { IcCancel, IcEx, IcLogin } from "../icons";

const AddLevel = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { addLevel, updateLevel } = useSettings();

    const [level, setLevel] = React.useState("");
    const [numberOfGroups, setNumberOfGroups] = React.useState(0);
    const [modules, setModules] = React.useState([]);
    const [moduleInput, setModuleInput] = React.useState("");

    React.useEffect(() => {
        if (model.update) {
            setLevel(model.value.name);
            setNumberOfGroups(model.value.numberOfGroups);
            setModules(model.value.modules);
        }
    }, []);

    const enterKeyPressHandler = (e) => {
        if (e.key !== "Enter" || !moduleInput) return;
        const value = moduleInput.trim(" ");
        const newModules = modules.filter((mod) => mod !== value);
        if (newModules.length !== modules.length) {
            return setAlert({
                type: "warn",
                message: `Module "${value} is already in the list"`,
            });
        }
        setModules((modules) => [...modules, value]);
        setModuleInput("");
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const newFaculty = {
            id: model.labelsData.levels.length,
            name: level,
            numberOfGroups,
            modules,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };

        if (model.update) {
            newFaculty.id = model.value.id;
            updateLevel(
                model.labelsData,
                model.setLabelsData,
                model.value.id,
                newFaculty
            );
        } else {
            const alreadyExist = model.labelsData.levels.filter(
                (f) => f.name === level
            ).length;
            if (alreadyExist)
                return setAlert({
                    type: "warn",
                    message: `faculty "${level}" already exists!`,
                });
            addLevel(model.labelsData, model.setLabelsData, newFaculty);
        }
        model.setSaved(false);
        setModel(null);
    };

    const removeModuleHandler = (value) => {
        const newModules = modules.filter((mod) => mod !== value);
        setModules(newModules);
    };

    return (
        <div className="fixed top-[4rem] left-[50%] z-40 w-full max-w-[600px] translate-x-[-50%] px-4">
            <div
                className={`w-full space-y-4 rounded-lg border-2 border-dark/25 bg-light p-4 shadow-lg`}
            >
                <div className="text-xl text-center text-primary">
                    Add New Level
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="input-label" htmlFor="level">
                        Level:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="text"
                        name="level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value.toUpperCase())}
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="input-label" htmlFor="numberOfGroups">
                        Number Of Groups In This Level:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="number"
                        name="numberOfGroups"
                        value={numberOfGroups}
                        onChange={(e) => setNumberOfGroups(e.target.value)}
                    />
                </div>
                <div className="textbox">
                    <span>Modules: </span>
                    {modules.map((mod) => (
                        <div key={mod}>
                            {mod}
                            <IcEx
                                id="modules"
                                onClick={(e) => removeModuleHandler(mod)}
                                className="textbox-icon"
                            />
                        </div>
                    ))}
                    <input
                        type="text"
                        id="modules"
                        placeholder="type here..."
                        value={moduleInput}
                        onChange={(e) =>
                            setModuleInput(e.target.value.toUpperCase())
                        }
                        onKeyPress={enterKeyPressHandler}
                    />
                </div>
                <div className="flex gap-x-6">
                    <Button
                        text="add"
                        type="success"
                        onClick={submitHandler}
                        Icon={IcLogin}
                    />
                    <Button
                        text="Cancel"
                        onClick={submitHandler}
                        Icon={IcCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddLevel;

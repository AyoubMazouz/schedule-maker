import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { IcCancel, IcEx, IcLogin } from "../icons";

const AddFaculty = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { addFaculty } = useSettings();

    const [faculty, setFaculty] = React.useState("");
    const [firstYear, setFirstYear] = React.useState(0);
    const [secondYear, setSecondYear] = React.useState(0);
    const [modules, setModules] = React.useState([]);
    const [moduleInput, setModuleInput] = React.useState("");

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
            id: model.data.faculties.length,
            name: faculty,
            firstYear,
            secondYear,
            modules,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };

        addFaculty(model.data, model.setData, newFaculty);
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
                <div className="text-center">
                    <div className="text-xl text-primary">LogIn</div>
                    <div>Only Authorized Admins are allowed here</div>
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
                        onChange={(e) => setFaculty(e.target.value)}
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
                <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg">
                    {modules.map((mod) => (
                        <div
                            key={mod}
                            className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 py-0.5 pl-3 pr-2  font-semibold text-dark"
                        >
                            <div>{mod}</div>

                            <IcEx
                                onClick={(e) => removeModuleHandler(mod)}
                                className="transition-all duration-300 hover:scale-125 hover:text-primary"
                            />
                        </div>
                    ))}
                    <input
                        type="text"
                        id="groupModule"
                        placeholder="type here..."
                        value={moduleInput}
                        onChange={(e) => setModuleInput(e.target.value)}
                        onKeyPress={enterKeyPressHandler}
                        className="h-[1.9rem] max-w-[8rem] rounded-full bg-light px-2 capitalize ring-primary focus:outline-none focus:ring-2"
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

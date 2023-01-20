import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { IcCancel, IcEx, IcLogin } from "../icons";

const AddTrainer = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { addTrainer } = useSettings();

    const [trainer, setTrainer] = React.useState("");
    const [room, setRoom] = React.useState([]);
    const [preferedRooms, setPreferedRooms] = React.useState([]);

    const enterKeyPressHandler = (e) => {
        if (e.key !== "Enter" || !room) return;

        const value = room.trim(" ");
        const newPreferedRooms = preferedRooms.filter((mod) => mod !== value);

        if (newPreferedRooms.length !== preferedRooms.length) {
            return setAlert({
                type: "warn",
                message: `room number "${value} is already in the list"`,
            });
        }

        setPreferedRooms((rooms) => [...rooms, value]);
        setRoom("");
    };

    const removeRoomHandler = (value) => {
        const newPreferedRooms = preferedRooms.filter((room) => room !== value);
        setPreferedRooms(newPreferedRooms);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const newtrainer = {
            id: model.data.trainers.length,
            name: trainer,
            preferedRooms,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };

        addTrainer(model.data, model.setData, newtrainer);
        model.setSaved(false);
        setModel(null);
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
                    <label className="input-label" htmlFor="trainer">
                        Trainer:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="text"
                        name="trainer"
                        value={trainer}
                        onChange={(e) => {
                            const value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            setTrainer(value);
                        }}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg">
                    {preferedRooms.map((room) => (
                        <div
                            key={room}
                            className="flex items-center gap-x-2 rounded-full border-2 border-dark/25 bg-dark/5 py-0.5 pl-3 pr-2  font-semibold text-dark"
                        >
                            <div>{room}</div>

                            <IcEx
                                onClick={(e) => removeRoomHandler(room)}
                                className="transition-all duration-300 hover:scale-125 hover:text-primary"
                            />
                        </div>
                    ))}
                    <input
                        type="text"
                        id="groupModule"
                        placeholder="type here..."
                        value={room}
                        onChange={(e) => setRoom(e.target.value.toUpperCase())}
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

export default AddTrainer;

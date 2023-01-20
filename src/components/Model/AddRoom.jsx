import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { IcCancel, IcEx, IcLogin } from "../icons";

const AddRoom = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { addRoom } = useSettings();

    const [room, setRoom] = React.useState("");

    const submitHandler = (e) => {
        e.preventDefault();

        const newRoom = {
            id: model.data.events.length,
            name: room,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };

        addRoom(model.data, model.setData, newRoom);
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
                    <label className="input-label" htmlFor="room">
                        Room:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="text"
                        name="room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value.toUpperCase())}
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

export default AddRoom;

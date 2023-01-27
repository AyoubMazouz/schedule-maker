import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcEx, IcLogin } from "../../icons";

const UpdateTrainer = () => {
    const { model, setModel, setAlert, labelsData, setLabelsData } =
        useGlobalContext();
    const { updateTrainer } = useSettings();

    const [trainerInput, setTrainerInput] = React.useState("");
    const [preferedRooms, setPreferedRooms] = React.useState([]);

    React.useEffect(() => {
        setTrainerInput(model.trainer.value);
        setPreferedRooms(model.trainer.preferedRooms);
    }, []);

    const addNewRoomHandler = (e) => {
        const room = e.target.value;
        const newPreferedRooms = preferedRooms.filter((r) => r !== room);

        if (newPreferedRooms.length !== preferedRooms.length) {
            return setAlert({
                type: "warn",
                message: `room number "${room} is already in the list"`,
            });
        }

        setPreferedRooms((rooms) => [...rooms, room]);
    };

    const removeRoomHandler = (value) => {
        const newPreferedRooms = preferedRooms.filter((room) => room !== value);
        setPreferedRooms(newPreferedRooms);
    };

    const submitHandler = (e) => {
        const res = updateTrainer(
            labelsData,
            setLabelsData,
            model.trainer,
            trainerInput,
            preferedRooms
        );
        if (res) {
            model.setSaved(false);
            setModel(null);
        } else {
            setAlert({
                type: "warn",
                message: `Trainer "${trainerInput}" already exists!`,
            });
            setTrainerInput("");
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="text-center text-xl text-primary">
                    Update Trainer
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="input-label" htmlFor="trainer">
                        Trainer:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="text"
                        name="trainer"
                        value={trainerInput}
                        onChange={(e) => {
                            const value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            setTrainerInput(value);
                        }}
                    />
                </div>
                <div className="textbox">
                    <span>Prefered Rooms: </span>
                    {preferedRooms.map((room) => (
                        <div key={room}>
                            {room}
                            <IcEx
                                id="preferedRooms"
                                onClick={(e) => removeRoomHandler(room)}
                                className="textbox-icon"
                            />
                        </div>
                    ))}
                    <select
                        name="preferedRooms"
                        className="input"
                        value=""
                        onChange={addNewRoomHandler}
                    >
                        <option value="" disabled>
                            Rooms...
                        </option>
                        {labelsData.rooms.map((room) => (
                            <option key={room.value} value={room.value}>
                                {room.value}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="model-btn-container">
                <Button
                    text="add"
                    type="success"
                    onClick={submitHandler}
                    Icon={IcLogin}
                />
                <Button
                    text="Cancel"
                    onClick={(e) => setModel(null)}
                    Icon={IcCancel}
                />
            </div>
        </>
    );
};

export default UpdateTrainer;

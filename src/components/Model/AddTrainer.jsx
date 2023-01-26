import { Timestamp } from "firebase/firestore";
import React from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import useSettings from "../../hooks/useSettings";
import { Button } from "../Button";
import { IcCancel, IcEx, IcLogin } from "../icons";

const AddTrainer = () => {
    const { model, setModel, setAlert } = useGlobalContext();
    const { addTrainer, updateTrainer } = useSettings();

    const [trainer, setTrainer] = React.useState("");
    const [preferedRooms, setPreferedRooms] = React.useState([]);

    React.useEffect(() => {
        if (model.update) {
            setTrainer(model.value.name);
            setPreferedRooms(model.value.preferedRooms);
        }
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
        e.preventDefault();

        const newtrainer = {
            id: model.labelsData.trainers.length,
            name: trainer,
            preferedRooms,
            createdAt: Timestamp.now(),
            modifiedAt: Timestamp.now(),
        };

        if (model.update) {
            newtrainer.id = model.value.id;
            updateTrainer(
                model.labelsData,
                model.setLabelsData,
                model.value.id,
                newtrainer
            );
        } else {
            const alreadyExist = model.labelsData.trainers.filter(
                (f) => f.name === trainer
            ).length;
            if (alreadyExist)
                return setAlert({
                    type: "warn",
                    message: `Trainer "${trainer}" already exists!`,
                });
            addTrainer(model.labelsData, model.setLabelsData, newtrainer);
        }
        model.setSaved(false);
        setModel(null);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="text-xl text-center text-primary">
                    Add New Trainer
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
                        {model.labelsData.rooms.map((room) => (
                            <option key={room.name} value={room.name}>
                                {room.name}
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

export default AddTrainer;

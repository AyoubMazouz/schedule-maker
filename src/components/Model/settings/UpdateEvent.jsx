import React from "react";
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import useSettings from "../../../hooks/useSettings";
import { Button } from "../../Button";
import { IcCancel, IcLogin } from "../../icons";

const UpdateEvent = () => {
    const { model, setModel, setAlert, labelsData, setLabelsData } =
        useGlobalContext();
    const { updateEvent } = useSettings();

    const [eventInput, setEventInput] = React.useState("");

    React.useEffect(() => {
        setEventInput(model.event.value);
    }, []);

    const submitHandler = () => {
        const res = updateEvent(
            labelsData,
            setLabelsData,
            model.event,
            eventInput
        );
        if (res) {
            model.setSaved(false);
            setModel(null);
        } else {
            setAlert({
                type: "warn",
                message: `event "${eventInput}" already exists!`,
            });
            setEventInput("");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center gap-y-6">
                <div className="text-center text-xl text-primary">
                    Update Event
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <label className="input-label" htmlFor="event">
                        Event:
                    </label>
                    <input
                        className="input max-w-[26rem]"
                        type="text"
                        name="event"
                        value={eventInput}
                        onChange={(e) =>
                            setEventInput(e.target.value.toUpperCase())
                        }
                    />
                </div>
            </div>
            <div className="model-btn-container">
                <Button
                    text="update"
                    type="success"
                    onClick={submitHandler}
                    Icon={IcLogin}
                />
                <Button
                    text="cancel"
                    onClick={() => setModel(null)}
                    Icon={IcCancel}
                />
            </div>
        </>
    );
};

export default UpdateEvent;

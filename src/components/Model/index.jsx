import { useGlobalContext } from "../../Contexts/GlobalContext";
import AddLevel from "./settings/AddLevel";
import AddRoom from "./settings/AddRoom";
import AddTrainer from "./settings/AddTrainer";
import DelDoc from "./DelDoc";
import DelPubDoc from "./DelPubDoc";
import Exit from "./Exit";
import Login from "./Login";
import NewDoc from "./NewDoc";
import RenDoc from "./RenDoc";
import ShowDetails from "./ShowDetails";
import AddEvent from "./settings/AddEvent";
import UpdateRoom from "./settings/UpdateRoom";
import UpdateEvent from "./settings/UpdateEvent";
import UpdateTrainer from "./settings/UpdateTrainer";
import UpdateLevel from "./settings/UpdateLevel";

const Model = () => {
    const { model } = useGlobalContext();

    if (!model) return null;

    const models = {
        deldoc: DelDoc,
        delpubdoc: DelPubDoc,
        newdoc: NewDoc,
        rendoc: RenDoc,
        exit: Exit,
        login: Login,
        showDetails: ShowDetails,
        addLevel: AddLevel,
        addTrainer: AddTrainer,
        addRoom: AddRoom,
        addEvent: AddEvent,
        updateRoom: UpdateRoom,
        updateEvent: UpdateEvent,
        updateTrainer: UpdateTrainer,
        updateLevel: UpdateLevel,
    };

    const Model = models[model.type];

    return (
        <div className="fixed inset-0 z-40 flex justify-center bg-dark/25 px-4 py-24">
            <div className="w-full max-w-[400px]">
                <div className="space-y-6 overflow-hidden rounded-lg border bg-light px-2 py-4 text-center shadow-lg">
                    <Model />
                </div>
            </div>
        </div>
    );
};

export default Model;

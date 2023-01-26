import { useGlobalContext } from "../../Contexts/GlobalContext";
import AddLevel from "./AddLevel";
import AddRoom from "./AddRoom";
import AddTrainer from "./AddTrainer";
import DelDoc from "./DelDoc";
import DelPubDoc from "./DelPubDoc";
import Exit from "./Exit";
import Login from "./Login";
import NewDoc from "./NewDoc";
import RenDoc from "./RenDoc";
import ShowDetails from "./ShowDetails";
import AddEvent from "./AddEvent";

const Model = () => {
    const { model } = useGlobalContext();

    const models = {
        deldoc: DelDoc,
        delpubdoc: DelPubDoc,
        newdoc: NewDoc,
        rendoc: RenDoc,
        exit: Exit,
        login: Login,
        addLevel: AddLevel,
        addTrainer: AddTrainer,
        addRoom: AddRoom,
        addEvent: AddEvent,
        showDetails: ShowDetails,
    };

    if (!model) return null;

    const Model = models[model.type];

    return (
        <div className="fixed inset-0 z-40 flex justify-center px-4 py-24 bg-dark/25">
            <div className="w-full max-w-[400px]">
                <div className="px-2 py-4 space-y-6 overflow-hidden text-center border rounded-lg shadow-lg bg-light">
                    <Model />
                </div>
            </div>
        </div>
    );
};

export default Model;

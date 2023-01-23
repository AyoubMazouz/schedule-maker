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
        deldoc: <DelDoc />,
        delpubdoc: <DelPubDoc />,
        newdoc: <NewDoc />,
        rendoc: <RenDoc />,
        exit: <Exit />,
        login: <Login />,
        addLevel: <AddLevel />,
        addTrainer: <AddTrainer />,
        addRoom: <AddRoom />,
        addEvent: <AddEvent />,
        showDetails: <ShowDetails />,
    };

    if (!model) return null;

    return models[model.type] ? models[model.type] : null;
};

export default Model;

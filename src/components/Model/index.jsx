import { useGlobalContext } from "../../Contexts/GlobalContext";
import DelDoc from "./DelDoc";
import Exit from "./Exit";
import Login from "./Login";
import NewDoc from "./NewDoc";
import RenDoc from "./RenDoc";

const Model = () => {
    const { model } = useGlobalContext();

    if (!model) return null;
    else if (model.type === "deldoc") return <DelDoc />;
    else if (model.type === "newdoc") return <NewDoc />;
    else if (model.type === "rendoc") return <RenDoc />;
    else if (model.type === "exit") return <Exit />;
    else if (model.type === "login") return <Login />;
    return null;
};

export default Model;

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

const CurrModel = ({ type }: { type: string }) => {
  switch (type) {
    case "deldoc":
      return <DelDoc />;
    case "delpubdoc":
      return <DelPubDoc />;
    case "newdoc":
      return <NewDoc />;
    case "rendoc":
      return <RenDoc />;
    case "exit":
      return <Exit />;
    case "login":
      return <Login />;
    case "showDetails":
      return <ShowDetails />;

    case "ADD_LEVEL":
    case "UPDATE_LEVEL":
      return <AddLevel />;
    case "ADD_TRAINER":
    case "UPDATE_TRAINER":
      return <AddTrainer />;
    case "ADD_ROOM":
    case "UPDATE_ROOM":
      return <AddRoom />;
    case "ADD_EVENT":
    case "UPDATE_EVENT":
      return <AddEvent />;

    default:
      return null;
  }
};

const Model = () => {
  const { model } = useGlobalContext();
  if (!model) return null;

  if (model.type === "NEW_DOC")
    return (
      <div className="fixed inset-0 z-40 flex justify-center bg-dark/50 px-4 py-24">
        <div className="w-full max-w-[800px]">
          <div className="space-y-6 rounded-lg border bg-light px-2 py-4 text-center shadow-lg">
            <NewDoc />
          </div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-dark/50 px-4 py-24">
      <div className="w-full max-w-[400px]">
        <div className="space-y-6 rounded-lg border bg-light px-2 py-4 text-center shadow-lg">
          <CurrModel type={model.type} />
        </div>
      </div>
    </div>
  );
};

export default Model;

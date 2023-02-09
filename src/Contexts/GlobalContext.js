import React from "react";
import useDocument from "../hooks/useDocument";
import useLabels from "../hooks/useLabels";

const GlobalContext = React.createContext();

export const useGlobalContext = () => {
  return React.useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }) => {
  const [alert, setAlert] = React.useState(null);
  const [model, setModel] = React.useState(null);
  const [docInfo, setDocInfo] = React.useState("");
  const [data, setData] = React.useState([]);
  const [labelsData, setLabelsData] = React.useState({
    trainers: [],
    rooms: [],
    levels: [],
    events: [],
  });

  const { getDocument } = useDocument();
  const { getLabels } = useLabels();

  React.useEffect(() => {
    const unsubscribe = setTimeout(() => {
      setAlert(null);
    }, 100000);
    return () => clearTimeout(unsubscribe);
  }, [alert]);

  React.useEffect(() => {
    const unsubscribe = setTimeout(() => {
      setAlert(null);
    }, 100000);
    return () => clearTimeout(unsubscribe);
  }, [alert]);

  const loadData = async (username, docId) => {
    const doc = await getDocument(username, docId);
    if (doc) {
      setData(JSON.parse(doc.data));
      delete doc.data;
      setDocInfo(doc);
    }
  };

  const loadLabelsData = async (username) => {
    const doc = await getLabels(username);
    if (doc) setLabelsData(doc);
  };

  return (
    <GlobalContext.Provider
      value={{
        alert,
        setAlert,
        model,
        setModel,
        labelsData,
        setLabelsData,
        loadData,
        loadLabelsData,
        docInfo,
        setDocInfo,
        data,
        setData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

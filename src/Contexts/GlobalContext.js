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
  const [data, setData] = React.useState([]);
  const [labelsData, setLabelsData] = React.useState({
    trainers: [],
    rooms: [],
    levels: [],
    events: [],
  });
  const [docId, setDocId] = React.useState("");

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
      setDocId(docId);
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
        data,
        setData,
        labelsData,
        setLabelsData,
        docId,
        setDocId,
        loadData,
        loadLabelsData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

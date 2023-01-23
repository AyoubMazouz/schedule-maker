import React from "react";
import useDocument from "../hooks/useDocument";

const GlobalContext = React.createContext();

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }) => {
    const [alert, setAlert] = React.useState(null);
    const [model, setModel] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [name, setName] = React.useState("");

    const { getDocument } = useDocument();

    React.useEffect(() => {
        const unsubscribe = setTimeout(() => {
            setAlert(null);
        }, 100000);
        return () => clearTimeout(unsubscribe);
    }, [alert]);

    const loadData = (name) => {
        return new Promise(async (resolve, reject) => {
            if (!name) resolve(false);
            const doc = await getDocument(name);
            if (doc) {
                setData(JSON.parse(doc.data));
                setName(doc.name);
                resolve(true);
            }
        });
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
                name,
                setName,
                loadData,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

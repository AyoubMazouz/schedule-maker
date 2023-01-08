import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate("/editor/documents");
    }, []);
    return <div>Home</div>;
};

export default Home;

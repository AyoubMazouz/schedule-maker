import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Home = () => {
  // const navigate = useNavigate();
  // const { currUser } = useAuth();
  // React.useEffect(() => {
  //     document.title = `SH-Maker - Home`;
  //     if (currUser) navigate("/documents");
  // }, []);
  return <div>Home</div>;
};

export default Home;

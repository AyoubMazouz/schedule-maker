import React from "react";

const Home = () => {
  React.useEffect(() => {
    document.title = `SH-Maker - Home`;
  }, []);
  return <div>Home</div>;
};

export default Home;
